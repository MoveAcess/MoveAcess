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
                sessionStorage.NIVEL_USUARIO = json.nivelAcesso; // Salva nivelAcesso como NIVEL_USUARIO

                console.log("📦 SessionStorage salvo:", {
                    EMAIL_USUARIO: json.email,
                    NOME_USUARIO: json.nome,
                    ID_USUARIO: json.idUsuario,
                    NIVEL_USUARIO: json.nivelAcesso
                });

                // Verificar se salvou corretamente
                console.log("🔍 Verificando sessionStorage:", {
                    EMAIL_USUARIO: sessionStorage.EMAIL_USUARIO,
                    NOME_USUARIO: sessionStorage.NOME_USUARIO,
                    ID_USUARIO: sessionStorage.ID_USUARIO,
                    NIVEL_USUARIO: sessionStorage.NIVEL_USUARIO
                });

                alert("Login realizado com sucesso!");

                // Redirecionar baseado no nível de acesso
                if (json.nivelAcesso === 1 || json.nivelAcesso === 2) {
                    // Admin - vai para o painel
                    window.location = "../dashboard/painel.html";
                } else {
                    // Usuário comum - vai para o dashboard
                    window.location = "/dashboard/mural.html";
                }
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

    return false;
}