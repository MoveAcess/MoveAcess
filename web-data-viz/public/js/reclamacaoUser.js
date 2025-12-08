document.addEventListener("DOMContentLoaded", () => {
    const btnNovaReclamacao = document.getElementById("btnNovaReclamacao");
    const modalNovaReclamacao = document.getElementById("modalNovaReclamacao");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const btnFilter = document.getElementById("btn_filter_reclamacao");
    const filterMenu = document.getElementById("filter_reclamacao_menu");
    const inputSearch = document.getElementById("input_search_reclamacao");

    let todasReclamacoes = [];
    let filtroAtual = "Todos";

    // Abrir modal
    btnNovaReclamacao.addEventListener("click", () => {
        carregarDadosModal();
        modalNovaReclamacao.style.display = "flex";
    });

    // Fechar modal
    btnFecharModal.addEventListener("click", () => {
        modalNovaReclamacao.style.display = "none";
        limparFormulario();
    });

    // Fechar modal ao clicar fora
    modalNovaReclamacao.addEventListener("click", (e) => {
        if (e.target === modalNovaReclamacao) {
            modalNovaReclamacao.style.display = "none";
            limparFormulario();
        }
    });

    // Toggle do menu de filtro
    if (btnFilter) {
        btnFilter.addEventListener("click", (e) => {
            e.stopPropagation();
            filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
        });
    }

    // Fechar menu de filtro ao clicar fora
    document.addEventListener("click", () => {
        if (filterMenu) filterMenu.style.display = "none";
    });

    // Prevenir fechamento ao clicar no menu
    if (filterMenu) {
        filterMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    // Aplicar filtros
    document.querySelectorAll(".filter-option").forEach(option => {
        option.addEventListener("click", () => {
            filtroAtual = option.dataset.status;
            document.getElementById("filter_status_text").textContent = filtroAtual;
            filterMenu.style.display = "none";
            aplicarFiltros();
        });
    });

    // Busca em tempo real
    if (inputSearch) {
        inputSearch.addEventListener("input", () => {
            aplicarFiltros();
        });
    }

    // Carregar reclamações ao iniciar
    listarReclamacoes();
});

function carregarDadosModal() {
    // Carregar veículos
    fetch(`/reclamacaoUser/veiculos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        const selectVeiculo = document.getElementById("veiculoReclamacao");
        if (selectVeiculo) {
            selectVeiculo.innerHTML = '<option value="">Selecione um veículo (opcional)</option>';
            data.dados.forEach(veiculo => {
                const descricao = `${veiculo.tipoTransporte} - ${veiculo.tipoVeiculo}`;
                selectVeiculo.innerHTML += `<option value="${veiculo.idVeiculo}">${descricao}</option>`;
            });
        }
    })
    .catch(error => console.error("Erro ao carregar veículos:", error));

    // Carregar locais
    fetch(`/reclamacaoUser/locais`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        const selectLocal = document.getElementById("localReclamacao");
        if (selectLocal) {
            selectLocal.innerHTML = '<option value="">Selecione um local (opcional)</option>';
            data.dados.forEach(local => {
                const descricao = local.municipio ? `${local.nome} - ${local.municipio}` : local.nome;
                selectLocal.innerHTML += `<option value="${local.idLocal}">${descricao}</option>`;
            });
        }
    })
    .catch(error => console.error("Erro ao carregar locais:", error));
}

function limparFormulario() {
    document.getElementById("tipoReclamacao").value = "";
    document.getElementById("descricaoReclamacao").value = "";
    document.getElementById("veiculoReclamacao").value = "";
    document.getElementById("localReclamacao").value = "";
}

function listarReclamacoes() {
    var id = sessionStorage.ID_USUARIO;

    fetch(`/reclamacaoUser/listar/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resposta:", data);
        todasReclamacoes = data.dados || [];
        
        atualizarCards(todasReclamacoes);
        aplicarFiltros();
    })
    .catch(error => {
        console.error("Erro ao listar reclamações:", error);
        mostrarMensagemErro("Erro ao carregar reclamações");
    });
}

function atualizarCards(reclamacoes) {
    const total = reclamacoes.length;
    const pendentes = reclamacoes.filter(r => r.status === "Pendente").length;
    const andamento = reclamacoes.filter(r => r.status === "Em andamento").length;
    const resolvidas = reclamacoes.filter(r => r.status === "Resolvido").length;

    const totalEl = document.getElementById("total-reclamacoes");
    const pendentesEl = document.getElementById("total-pendentes");
    const andamentoEl = document.getElementById("total-andamento");
    const resolvidasEl = document.getElementById("total-resolvidas");

    if (totalEl) totalEl.textContent = total;
    if (pendentesEl) pendentesEl.textContent = pendentes;
    if (andamentoEl) andamentoEl.textContent = andamento;
    if (resolvidasEl) resolvidasEl.textContent = resolvidas;
}

function aplicarFiltros() {
    const inputSearch = document.getElementById("input_search_reclamacao");
    const termoBusca = inputSearch ? inputSearch.value.toLowerCase() : "";
    
    let reclamacoesFiltradas = todasReclamacoes;

    // Filtro por status
    if (filtroAtual !== "Todos") {
        reclamacoesFiltradas = reclamacoesFiltradas.filter(r => r.status === filtroAtual);
    }

    // Filtro por busca
    if (termoBusca) {
        reclamacoesFiltradas = reclamacoesFiltradas.filter(r => {
            return (
                r.idReclamacao.toString().includes(termoBusca) ||
                r.tipo?.toLowerCase().includes(termoBusca) ||
                r.descricao?.toLowerCase().includes(termoBusca) ||
                r.veiculo?.toLowerCase().includes(termoBusca) ||
                r.local?.toLowerCase().includes(termoBusca) ||
                r.status?.toLowerCase().includes(termoBusca)
            );
        });
    }

    renderizarTabela(reclamacoesFiltradas);
}

function renderizarTabela(reclamacoes) {
    const tabela = document.getElementById("tabelaReclamacoesUser");
    const mensagem = document.getElementById("mensagemSemReclamacoes");

    if (!tabela) return;

    tabela.innerHTML = "";

    if (reclamacoes.length === 0) {
        if (mensagem) {
            mensagem.style.display = "block";
            mensagem.textContent = "Nenhuma reclamação encontrada.";
        }
        return;
    }

    if (mensagem) mensagem.style.display = "none";

    reclamacoes.forEach(reclamacao => {
        const linha = tabela.insertRow();
        
        // ID
        linha.insertCell(0).innerText = reclamacao.idReclamacao;
        
        // Data/Hora
        const dataHora = reclamacao.dataHoraCriacao 
            ? formatarDataHora(reclamacao.dataHoraCriacao)
            : "N/A";
        linha.insertCell(1).innerText = dataHora;
        
        // Tipo
        linha.insertCell(2).innerText = reclamacao.tipo || "N/A";
        
        // Local (pode ser veículo ou local de embarque)
        const localInfo = reclamacao.veiculo || reclamacao.local || "N/A";
        linha.insertCell(3).innerText = localInfo;
        
        // Status com badge
        const cellStatus = linha.insertCell(4);
        cellStatus.innerHTML = criarBadgeStatus(reclamacao.status);
        
        // Descrição (truncada)
        const descricao = reclamacao.descricao || "Sem descrição";
        const descricaoTruncada = descricao.length > 50 
            ? descricao.substring(0, 50) + "..." 
            : descricao;
        linha.insertCell(5).innerHTML = `<span title="${descricao}">${descricaoTruncada}</span>`;
        
        // Ações
        linha.insertCell(6).innerHTML = `
            <button onclick="deletarReclamacao(${reclamacao.idReclamacao})" 
                    class="btn-acao btn-deletar" 
                    title="Deletar reclamação">
                <i class="fas fa-trash"></i>
            </button>
        `;
    });
}

function criarBadgeStatus(status) {
    let classe = "badge-status";
    
    if (status === "Pendente") {
        classe += " badge-pendente";
    } else if (status === "Em andamento") {
        classe += " badge-andamento";
    } else if (status === "Resolvido") {
        classe += " badge-resolvido";
    }
    
    return `<span class="${classe}">${status}</span>`;
}

function formatarDataHora(dataString) {
    try {
        const data = new Date(dataString);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch (error) {
        return "Data inválida";
    }
}

function criarReclamacao() {
    const tipo = document.getElementById("tipoReclamacao").value.trim();
    const descricao = document.getElementById("descricaoReclamacao").value.trim();
    const fkVeiculo = document.getElementById("veiculoReclamacao").value || null;
    const fkLocalEmbarque = document.getElementById("localReclamacao").value || null;

    // Validações
    if (!tipo) {
        alert("Por favor, informe o tipo da reclamação.");
        return;
    }
    if (!descricao) {
        alert("Por favor, descreva a reclamação.");
        return;
    }
    if (!fkVeiculo && !fkLocalEmbarque) {
        alert("Por favor, selecione um veículo ou um local de embarque.");
        return;
    }
    if (descricao.length > 100) {
        alert("A descrição não pode ter mais de 100 caracteres.");
        return;
    }

    const statusReclamacao = "Pendente";
    const id = sessionStorage.ID_USUARIO;

    const btnEnviar = document.getElementById("btnEnviarReclamacao");
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";
    }

    fetch(`/reclamacaoUser/criar/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tipo: tipo,
            descricao: descricao,
            fkVeiculo: fkVeiculo,
            fkLocalEmbarque: fkLocalEmbarque,
            statusReclamacao: statusReclamacao
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Reclamação criada com sucesso:", data);
        
        document.getElementById("modalNovaReclamacao").style.display = "none";
        limparFormulario();
        listarReclamacoes();
        mostrarMensagemSucesso("Reclamação criada com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao criar reclamação:", error);
        mostrarMensagemErro("Erro ao criar reclamação. Tente novamente.");
    })
    .finally(() => {
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar";
        }
    });
}

function deletarReclamacao(idReclamacao) {
    if (!confirm("Tem certeza que deseja deletar esta reclamação?")) {
        return;
    }

    fetch(`/reclamacaoUser/excluir/${idReclamacao}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Reclamação deletada com sucesso:", data);
        listarReclamacoes();
        mostrarMensagemSucesso("Reclamação deletada com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao deletar reclamação:", error);
        mostrarMensagemErro("Erro ao deletar reclamação. Tente novamente.");
    });
}

function mostrarMensagemSucesso(mensagem) {
    alert(mensagem);
}

function mostrarMensagemErro(mensagem) {
    alert(mensagem);
}