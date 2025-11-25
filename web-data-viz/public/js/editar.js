let modoEdicao = false;

function editar() {
    const spanNome = document.getElementById("nome");
    const spanEmail = document.getElementById("email");

    if (!modoEdicao) {
        // ENTRAR EM MODO DE EDIÇÃO
        modoEdicao = true;

        const nomeAtual = spanNome.innerText;
        const emailAtual = spanEmail.innerText;

        spanNome.innerHTML = `<input id="input_nome" value="${nomeAtual}" class="input-editar">`;
        spanEmail.innerHTML = `<input id="input_email" value="${emailAtual}" class="input-editar">`;

        document.querySelector(".stat-change.positive").innerText = "Salvar";

    } else {
        // SALVAR ALTERAÇÕES
        modoEdicao = false;

        const novoNome = document.getElementById("input_nome").value;
        const novoEmail = document.getElementById("input_email").value;
        const id = sessionStorage.ID_USUARIO;

        fetch(`/usuarios/editar/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: novoNome,
                email: novoEmail
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro ao atualizar usuário");
            }
            return res.json();
        })
        .then(data => {
            alert("Dados atualizados com sucesso!");

            // Atualiza visualmente
            spanNome.innerText = novoNome;
            spanEmail.innerText = novoEmail;

            sessionStorage.NOME_USUARIO = novoNome;
            sessionStorage.EMAIL_USUARIO = novoEmail;

            document.querySelector(".stat-change.positive").innerText = "Alterar";
        })
        .catch(err => {
            console.error(err);
            alert("Falha ao atualizar. Tente novamente!");
        });
    }
}
