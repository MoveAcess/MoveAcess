 function deletar() {
        let id = sessionStorage.ID_USUARIO;

        fetch("/usuarios/deletar/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idServer: id
            })
        }).then(function (resposta) {
            console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log("Deletado com sucesso!");
                alert("Usuário deletado com sucesso.");
                limparSessao();
                window.location.href = "../index.html";
            } else {
                console.log("Houve um erro ao deletar.");
            }
        }).catch(function (erro) {
            console.log(erro);
        })

        return false;
    }