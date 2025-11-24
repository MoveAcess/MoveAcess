var database = require("../database/config");

function listarComentariosDaReclamacao(idReclamacao) {
    var instrucao = `
        SELECT 
            c.idComentario,
            c.comentario,
            c.dataHoraComentario,
            u.email AS usuarioEmail,
            c.fkUsuario AS idUsuario
        FROM comentarios c
        JOIN usuario u ON c.fkUsuario = u.idUsuario
        WHERE c.fkReclamacao = ${idReclamacao}
        ORDER BY c.dataHoraComentario ASC;
    `;
    console.log("Executando query:", instrucao);
    return database.executar(instrucao);
}

function criarComentario(idReclamacao, idUsuario, texto) {
    // Escapar aspas simples para prevenir SQL injection
    const textoEscapado = texto.replace(/'/g, "''");
    
    var instrucao = `
        INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
        VALUES (${idReclamacao}, ${idUsuario}, '${textoEscapado}', NOW());
    `;
    console.log("Criando comentário:", instrucao);
    return database.executar(instrucao);
}

function atualizarComentario(idComentario, idUsuario, texto) {
    // Escapar aspas simples para prevenir SQL injection
    const textoEscapado = texto.replace(/'/g, "''");
    
    var instrucao = `
        UPDATE comentarios
        SET comentario = '${textoEscapado}'
        WHERE idComentario = ${idComentario}
        AND fkUsuario = ${idUsuario};
    `;
    console.log("Atualizando comentário:", instrucao);
    return database.executar(instrucao);
}

function deletarComentario(idComentario, idUsuario) {
    var instrucao = `
        DELETE FROM comentarios
        WHERE idComentario = ${idComentario}
        AND fkUsuario = ${idUsuario};
    `;
    console.log("Deletando comentário:", instrucao);
    return database.executar(instrucao);
}

module.exports = {
    listarComentariosDaReclamacao,
    criarComentario,
    atualizarComentario,
    deletarComentario
};