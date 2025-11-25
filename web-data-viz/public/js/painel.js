let complaints = [];
let currentFilter = 'Todos';
let currentSearch = '';
let currentUserId = null;
let currentUserNivel = null;
let currentUserNome = null;
const API_BASE_URL = 'http://localhost:8080';

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    // Carregar dados do usuário do sessionStorage
    if (!loadUserFromSession()) {
        return; // Se falhar, a função já redireciona
    }
    
    loadComplaints();
    setupEventListeners();
});

// Função para carregar dados do usuário do sessionStorage
function loadUserFromSession() {
    const idUsuario = sessionStorage.getItem('ID_USUARIO');
    const nomeUsuario = sessionStorage.getItem('NOME_USUARIO');
    const nivelAcesso = sessionStorage.getItem('NIVEL_USUARIO'); // Usando NIVEL_USUARIO
    
    console.log('SessionStorage:', { idUsuario, nomeUsuario, nivelAcesso });
    
    // Verificar se o usuário está logado
    if (!idUsuario || !nivelAcesso) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../html/login.html';
        return false;
    }
    
    // Converter para números
    currentUserId = parseInt(idUsuario);
    currentUserNivel = parseInt(nivelAcesso);
    currentUserNome = nomeUsuario;
    
    // Verificar se é admin (nível 1 ou 2)
    if (currentUserNivel !== 1 && currentUserNivel !== 2) {
        alert('Acesso negado! Apenas administradores (nível 1 ou 2) podem acessar este painel.');
        window.location.href = '../html/dashboard.html'; // Redirecionar para página do usuário comum
        return false;
    }
    
    console.log('✅ Usuário autenticado:', {
        id: currentUserId,
        nome: currentUserNome,
        nivel: currentUserNivel
    });
    
    return true;
}

// ==================== CARREGAR RECLAMAÇÕES ====================
function loadComplaints() {
    fetch(`${API_BASE_URL}/reclamacoes`)
        .then(res => {
            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
            return res.json();
        })
        .then(data => {
            complaints = data.map(r => ({
                id: r.idReclamacao,
                idOriginal: r.idReclamacao,
                date: formatDate(r.dataHoraCriacao),
                time: formatTime(r.dataHoraCriacao),
                type: r.tipo || 'Não especificado',
                location: 'Local não especificado',
                priority: definePriority(r.tipo),
                status: r.statusReclamacao,
                description: r.descricao || 'Sem descrição',
                usuarioEmail: r.usuarioEmail,
                usuarioNivel: r.usuarioNivel,
                comments: []
            }));
            updateStats();
            renderComplaints();
        })
        .catch(err => {
            console.error("Erro:", err);
            alert("Erro ao carregar reclamações!");
        });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
}

function definePriority(tipo) {
    if (!tipo) return "Baixa";
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes("elevador") || tipoLower.includes("urgente")) return "Alta";
    if (tipoLower.includes("piso") || tipoLower.includes("rampa") || tipoLower.includes("acesso")) return "Média";
    return "Baixa";
}

function updateStats() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'Pendente').length;
    const inProgress = complaints.filter(c => c.status === 'Em andamento').length;
    const resolved = complaints.filter(c => c.status === 'Resolvido').length;
    const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : 0;
    
    document.getElementById('total-complaints').textContent = total;
    document.getElementById('pending-complaints').textContent = pending;
    document.getElementById('inprogress-complaints').textContent = inProgress;
    document.getElementById('resolved-complaints').textContent = resolved;
    document.getElementById('resolution-rate').textContent = `${resolutionRate}%`;
}

function getStatusClass(status) {
    const map = {
        'Pendente': 'pendente',
        'Em andamento': 'em-andamento',
        'Resolvido': 'resolvido'
    };
    return map[status] || 'pendente';
}

function getStatusIcon(status) {
    if (status === 'Pendente') {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else if (status === 'Em andamento') {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    } else {
        return '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    }
}

function renderComplaints() {
    const tbody = document.getElementById('complaints-tbody');
    const noResults = document.getElementById('no-results');
    
    let filtered = complaints;
    
    if (currentFilter !== 'Todos') {
        filtered = filtered.filter(c => c.type.includes(currentFilter));
    }
    
    if (currentSearch) {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(c => 
            c.id.toString().includes(searchLower) ||
            c.type.toLowerCase().includes(searchLower) ||
            c.location.toLowerCase().includes(searchLower) ||
            c.description.toLowerCase().includes(searchLower)
        );
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    tbody.innerHTML = filtered.map(complaint => `
        <tr id="row-${complaint.idOriginal}">
            <td><span class="complaint-id">REC-${complaint.id}</span></td>
            <td>
                <div class="datetime-cell">
                    <span class="date">${complaint.date}</span>
                    <span class="time">${complaint.time}</span>
                </div>
            </td>
            <td><span class="type-badge">${complaint.type}</span></td>
            <td>${complaint.location}</td>
            <td><span class="priority-badge priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span></td>
            <td>
                <div class="status-selector">
                    <button class="status-badge status-${getStatusClass(complaint.status)}" onclick="toggleStatusMenu(${complaint.idOriginal}, event)">
                        ${getStatusIcon(complaint.status)}
                        <span>${complaint.status}</span>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="status-menu" id="status-menu-${complaint.idOriginal}">
                        <div class="status-menu-header">Atualizar Status</div>
                        <div class="status-menu-content">
                            <button class="status-option status-pendente ${complaint.status === 'Pendente' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Pendente', event)">
                                <span class="status-dot dot-pendente"></span>
                                <span>Pendente</span>
                                ${complaint.status === 'Pendente' ? '<svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' : ''}
                            </button>
                            <button class="status-option status-em-andamento ${complaint.status === 'Em andamento' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Em andamento', event)">
                                <span class="status-dot dot-em-andamento"></span>
                                <span>Em andamento</span>
                                ${complaint.status === 'Em andamento' ? '<svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' : ''}
                            </button>
                            <button class="status-option status-resolvido ${complaint.status === 'Resolvido' ? 'selected' : ''}" onclick="updateStatus(${complaint.idOriginal}, 'Resolvido', event)">
                                <span class="status-dot dot-resolvido"></span>
                                <span>Resolvido</span>
                                ${complaint.status === 'Resolvido' ? '<svg class="checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            </td>
            <td><span class="description-text">${complaint.description}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view-btn" onclick="viewComplaint(${complaint.idOriginal})" title="Ver detalhes">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button class="action-btn comment-btn" onclick="toggleComments(${complaint.idOriginal})" title="Comentários">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
        <tr id="comments-row-${complaint.idOriginal}" class="comments-row" style="display: none;">
            <td colspan="8">
                <div class="comments-section" id="comments-section-${complaint.idOriginal}">
                    <div class="comments-header">
                        <h4>💬 Comentários - REC-${complaint.id}</h4>
                        <button class="close-comments-btn" onclick="toggleComments(${complaint.idOriginal})">✕</button>
                    </div>
                    <div class="comments-list" id="comments-list-${complaint.idOriginal}">
                        <div class="loading-comments">Carregando comentários...</div>
                    </div>
                    <div class="add-comment-form">
                        <textarea id="comment-input-${complaint.idOriginal}" placeholder="Escreva um comentário..." rows="2"></textarea>
                        <button class="add-comment-btn" onclick="addComment(${complaint.idOriginal})">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviar
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== FUNÇÕES DE COMENTÁRIOS ====================
function toggleComments(id) {
    const commentsRow = document.getElementById(`comments-row-${id}`);
    const isVisible = commentsRow.style.display !== 'none';
    
    // Fechar todos os outros
    document.querySelectorAll('.comments-row').forEach(row => {
        row.style.display = 'none';
    });
    
    if (!isVisible) {
        commentsRow.style.display = 'table-row';
        loadComments(id);
    }
}

function loadComments(idReclamacao) {
    const commentsList = document.getElementById(`comments-list-${idReclamacao}`);
    commentsList.innerHTML = '<div class="loading-comments">Carregando...</div>';
    
    fetch(`${API_BASE_URL}/reclamacoes/${idReclamacao}/comentarios`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP ${res.status}: ${res.statusText}`);
            }
            return res.json();
        })
        .then(comments => {
            if (!comments || comments.length === 0) {
                commentsList.innerHTML = '<div class="no-comments">Nenhum comentário ainda. Seja o primeiro!</div>';
                return;
            }
            
            // Admin pode ver todos os comentários, mas só editar/deletar os seus
            commentsList.innerHTML = comments.map(c => {
                const isMyComment = (c.idUsuario === currentUserId);
                
                return `
                <div class="comment-item" id="comment-${c.idComentario}">
                    <div class="comment-header">
                        <span class="comment-author">
                            ${c.usuarioEmail}
                            ${isMyComment ? '<span style="color: #3B82F6; font-size: 11px; margin-left: 6px;">(Você)</span>' : ''}
                        </span>
                        <span class="comment-date">${formatDate(c.dataHoraComentario)} ${formatTime(c.dataHoraComentario)}</span>
                    </div>
                    <div class="comment-text" id="comment-text-${c.idComentario}">${c.comentario}</div>
                    ${isMyComment ? `
                        <div class="comment-actions">
                            <button class="comment-action-btn edit-btn" onclick="editComment(${c.idComentario}, '${c.comentario.replace(/'/g, "\\'")}')">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                            <button class="comment-action-btn delete-btn" onclick="deleteComment(${c.idComentario}, ${idReclamacao})">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Excluir
                            </button>
                        </div>
                    ` : ''}
                </div>
            `}).join('');
        })
        .catch(err => {
            console.error("Erro ao carregar comentários:", err);
            commentsList.innerHTML = `<div class="error-comments">Erro: ${err.message}<br><small>Verifique se a rota está configurada corretamente</small></div>`;
        });
}

function addComment(idReclamacao) {
    const input = document.getElementById(`comment-input-${idReclamacao}`);
    const texto = input.value.trim();
    
    if (!texto) {
        alert("Digite um comentário!");
        return;
    }
    
    if (!currentUserId) {
        alert("Erro ao identificar usuário. Faça login novamente.");
        return;
    }
    
    fetch(`${API_BASE_URL}/reclamacoes/${idReclamacao}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId, texto: texto })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao adicionar comentário');
        return res.json();
    })
    .then(() => {
        input.value = '';
        loadComments(idReclamacao);
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao adicionar comentário.");
    });
}

function editComment(idComentario, textoAtual) {
    const commentText = document.getElementById(`comment-text-${idComentario}`);
    const novoTexto = prompt("Editar comentário:", textoAtual);
    
    if (novoTexto === null || novoTexto.trim() === '') return;
    
    fetch(`${API_BASE_URL}/reclamacoes/comentarios/${idComentario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId, texto: novoTexto.trim() })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao editar');
        return res.json();
    })
    .then(() => {
        commentText.textContent = novoTexto.trim();
        alert('Comentário editado com sucesso!');
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao editar comentário.");
    });
}

function deleteComment(idComentario, idReclamacao) {
    if (!confirm("Deseja excluir este comentário?")) return;
    
    fetch(`${API_BASE_URL}/reclamacoes/comentarios/${idComentario}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario: currentUserId })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao excluir');
        return res.json();
    })
    .then(() => {
        loadComments(idReclamacao);
        alert('Comentário excluído com sucesso!');
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao excluir comentário.");
    });
}

// ==================== FUNÇÕES DE STATUS ====================
function toggleStatusMenu(id, event) {
    event.stopPropagation();
    document.querySelectorAll('.status-menu').forEach(menu => {
        if (menu.id !== `status-menu-${id}`) menu.classList.remove('show');
    });
    document.getElementById(`status-menu-${id}`).classList.toggle('show');
}

function updateStatus(id, newStatus, event) {
    event.stopPropagation();
    const menu = document.getElementById(`status-menu-${id}`);
    if (menu) menu.classList.remove('show');
    
    fetch(`${API_BASE_URL}/reclamacoes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
    })
    .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar');
        return res.json().catch(() => ({}));
    })
    .then(() => {
        loadComplaints();
        alert(`Status atualizado para: ${newStatus}`);
    })
    .catch(err => {
        console.error("Erro:", err);
        alert("Erro ao atualizar status.");
    });
}

function viewComplaint(id) {
    const complaint = complaints.find(c => c.idOriginal === id);
    if (complaint) {
        alert(`Reclamação #${complaint.id}\nStatus: ${complaint.status}\nTipo: ${complaint.type}\nDescrição: ${complaint.description}`);
    }
}

function setupEventListeners() {
    document.addEventListener('click', function() {
        document.querySelectorAll('.status-menu').forEach(menu => menu.classList.remove('show'));
        document.getElementById('filter-menu').classList.remove('show');
    });
    
    document.getElementById('search-input').addEventListener('input', function() {
        currentSearch = this.value;
        renderComplaints();
    });
    
    document.getElementById('filter-button').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('filter-menu').classList.toggle('show');
    });
    
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelectorAll('.filter-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            document.getElementById('filter-text').textContent = currentFilter;
            renderComplaints();
            document.getElementById('filter-menu').classList.remove('show');
        });
    });
}