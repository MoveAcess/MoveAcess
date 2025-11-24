var database = require("../database/config");

function listarTodas() {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkLocalEmbarque,
            u.email AS usuarioEmail,
            u.nivelAcesso AS usuarioNivel
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        ORDER BY r.dataHoraCriacao DESC;
    `;
    return database.executar(instrucao);
}

function listarPorId(idReclamacao) {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkLocalEmbarque,
            u.email AS usuarioEmail,
            u.nivelAcesso AS usuarioNivel
        FROM reclamacao r
        JOIN usuario u ON r.fkUsuario = u.idUsuario
        WHERE r.idReclamacao = ?;
    `;
    return database.executar(instrucao, [idReclamacao]);
}

function atualizarStatus(idReclamacao, novoStatus) {
    var instrucao;
    
    if (novoStatus === 'Resolvido') {
        instrucao = `
            UPDATE reclamacao
            SET statusReclamacao = '${novoStatus}',
                dataHoraResolucao = NOW()
            WHERE idReclamacao = ${idReclamacao};
        `;
    } else {
        instrucao = `
            UPDATE reclamacao
            SET statusReclamacao = '${novoStatus}'
            WHERE idReclamacao = ${idReclamacao};
        `;
    }
    
    console.log("SQL a executar:", instrucao); 
    return database.executar(instrucao);
}

module.exports = {
    listarTodas,
    listarPorId,
    atualizarStatus
};