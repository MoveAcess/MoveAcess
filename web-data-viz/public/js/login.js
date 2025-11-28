function entrar() {
    var email = document.getElementById("input_email").value;
    var senha = document.getElementById("input_senha").value;

    // Validações
    if (!email) {
        alert("Por favor, preencha o email!");
        return false;
    }

    if (!senha) {
        alert("Por favor, preencha a senha!");
        return false;
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: email,
            senhaServer: senha
        })
    }).then(function (resposta) {
        console.log("ESTOU NO THEN DO entrar()!")

        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log("✅ Dados recebidos do backend:", json);

                // Salvar no sessionStorage (backend retorna nivelAcesso)
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.idUsuario;
                sessionStorage.NIVEL_USUARIO = json.nivel_acesso;

                alert("Login realizado com sucesso!");
                window.location = "/dashboard/mural.html";
            });

        } else if (resposta.status === 403) {
            resposta.text().then(msg => {
                alert(msg); 
            });

        } else {
            alert("Erro ao tentar fazer login.");
        }
    })
    .catch(function (erro) {
        console.log(erro);
        alert("Erro de conexão com o servidor.");
    });
}