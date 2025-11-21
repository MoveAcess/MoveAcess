function visualizar() {
    var id = sessionStorage.ID_USUARIO;

    fetch(`/usuarios/visualizar/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.nome);
            console.log(data.email);
            
            document.getElementById('nome').innerText = data.nome;
            document.getElementById('email').innerText = data.email;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do usuário:', error);
        });
}
