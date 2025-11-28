function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var id = sessionStorage.ID_USUARIO;
    var nivel = sessionStorage.NIVEL_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null && id != null && nivel != null) {
        if (b_usuario) {
            b_usuario.innerHTML = id + " - " + nome + " - " + nivel;
        }
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}
