var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL - autenticar ->", email);

    var instrucaoSql = `
        SELECT idUsuario, nome, email, nivel_acesso
        FROM usuario
        WHERE email = '${email}' AND senha = '${senha}';    
        `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(nome, email, senha, nivel_acesso) {
    console.log("ACESSEI O USUARIO MODEL - cadastrar ->", nome, email);
    var instrucaoSql = `
        INSERT INTO usuario (nome, nivel_acesso, email, senha)
        VALUES ('${nome}', ${nivel_acesso}, '${email}', '${senha}');
        `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function visualizar(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL - visualizar ->", idUsuario);
    var instrucaoSql = `
        SELECT idUsuario, nome, email, nivel_acesso
        FROM usuario
        WHERE idUsuario = ${idUsuario};    
        `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL - deletar ->", idUsuario);

    var instrucaoSql = `
    DELETE FROM usuario WHERE idUsuario = '${idUsuario}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(id, nome, email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar():", id, nome, email);

    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}' WHERE idUsuario = ${id};
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    autenticar,
    cadastrar,
    visualizar,
    deletar,
    editar
};