function cadastrar() {
  var nome = document.getElementById("input_nome").value;
  var email = document.getElementById("input_email").value;
  var senha = document.getElementById("input_senha").value;


  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nome,
      emailServer: email,
      senhaServer: senha,
    }),
  })
  window.location.href = "login.html";
}