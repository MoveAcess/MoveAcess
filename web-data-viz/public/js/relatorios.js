async function carregarReclamacoes() {
    const tabela = document.querySelector(".reclamacoes-table tbody");
    tabela.innerHTML = "";

    const nivel = Number(sessionStorage.NIVEL_USUARIO);
    const isAdmin = nivel == 1;

    const response = await fetch("/reclamacoes/listar");
    const lista = await response.json();

    lista.forEach(r => {
        let botoes = "";

        if (isAdmin) {
            botoes = `
                <td class="acoes">
                    <button class="btn-editar" onclick="editarReclamacao(${r.idReclamacao})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-excluir" onclick="excluirReclamacao(${r.idReclamacao})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>`;
        }

        tabela.innerHTML += `
            <tr>
                <td>REC-${String(r.idReclamacao).padStart(4, "0")}</td>
                <td>${r.dataCriacao}</td>
                <td>${r.tipo}</td>
                <td>${r.local || "-"}</td>
                <td>${r.statusReclamacao}</td>
                <td>${r.descricao}</td>
                ${botoes}
            </tr>
        `;
    });
}

async function excluirReclamacao(id) {
    if (!confirm("Deseja excluir esta reclamação?")) return;

    await fetch(`/reclamacoes/deletar/${id}`, { method: "DELETE" });
    carregarReclamacoes(); 
}

async function editarReclamacao(id) {
    const status = prompt("Novo status: Pendente / Em andamento / Resolvido");
    const descricao = prompt("Nova descrição:");

    await fetch(`/reclamacoes/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, descricao })
    });

    carregarReclamacoes();
}

window.onload = () => {
    validarSessao();
    carregarReclamacoes();
};