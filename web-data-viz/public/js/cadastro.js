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
  }).then(function (resposta) {
      console.log("resposta: ", resposta);
      if (resposta.ok) {
        console.log("Cadastro realizado com sucesso!");
        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
      } else {
        throw new Error("Erro ao cadastrar usuário.");
      }
    }).catch(function (erro) {
      console.error("Erro ao cadastrar usuário: ", erro);
      alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
    });
}