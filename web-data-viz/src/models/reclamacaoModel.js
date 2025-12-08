var database = require("../database/config");


function listar() {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            DATE_FORMAT(r.dataHoraCriacao, '%d/%m/%Y %H:%i') AS dataCriacao,
            DATE_FORMAT(r.dataHoraResolucao, '%d/%m/%Y %H:%i') AS dataResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            v.tipoVeiculo AS tipoVeiculo,
            l.nome AS local,
            u.nome AS nomeUsuario
        FROM reclamacao r
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        LEFT JOIN usuario u ON r.fkUsuario = u.idUsuario
        ORDER BY r.idReclamacao DESC;
    `;
    return database.executar(instrucao);
}

function listarPorUsuario(idUsuario) {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            DATE_FORMAT(r.dataHoraCriacao, '%d/%m/%Y %H:%i') AS dataCriacao,
            DATE_FORMAT(r.dataHoraResolucao, '%d/%m/%Y %H:%i') AS dataResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            v.tipoVeiculo AS tipoVeiculo,
            l.nome AS local
        FROM reclamacao r
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        WHERE r.fkUsuario = ${idUsuario}
        ORDER BY r.idReclamacao DESC;
    `;
    return database.executar(instrucao);
}

function buscarPorId(id) {
    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            DATE_FORMAT(r.dataHoraCriacao, '%d/%m/%Y %H:%i') AS dataCriacao,
            DATE_FORMAT(r.dataHoraResolucao, '%d/%m/%Y %H:%i') AS dataResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario
        FROM reclamacao r
        WHERE r.idReclamacao = ${id};
    `;
    return database.executar(instrucao);
}

function inserir(reclamacao) {
    // reclamacao: { statusReclamacao, tipo, descricao, dataHoraCriacao, fkVeiculo, fkLocalEmbarque, fkUsuario }
    var dataCriacao = reclamacao.dataHoraCriacao ? `'${reclamacao.dataHoraCriacao}'` : 'NOW()';
    var fkVeiculo = reclamacao.fkVeiculo ? reclamacao.fkVeiculo : 'NULL';
    var fkLocal = reclamacao.fkLocalEmbarque ? reclamacao.fkLocalEmbarque : 'NULL';

    var instrucao = `
        INSERT INTO reclamacao
            (statusReclamacao, tipo, descricao, dataHoraCriacao, fkVeiculo, fkLocalEmbarque, fkUsuario)
        VALUES
            ('${reclamacao.statusReclamacao}', '${reclamacao.tipo}', '${reclamacao.descricao}', ${dataCriacao}, ${fkVeiculo}, ${fkLocal}, ${reclamacao.fkUsuario});
    `;
    return database.executar(instrucao);
}

function editar(id, campos) {
    // campos: { statusReclamacao, descricao, dataHoraResolucao, fkVeiculo, fkLocalEmbarque }
    var updates = [];

    if (campos.statusReclamacao !== undefined) updates.push(`statusReclamacao = '${campos.statusReclamacao}'`);
    if (campos.descricao !== undefined) updates.push(`descricao = '${campos.descricao}'`);
    if (campos.dataHoraResolucao !== undefined) updates.push(`dataHoraResolucao = '${campos.dataHoraResolucao}'`);
    if (campos.fkVeiculo !== undefined) updates.push(`fkVeiculo = ${campos.fkVeiculo === null ? 'NULL' : campos.fkVeiculo}`);
    if (campos.fkLocalEmbarque !== undefined) updates.push(`fkLocalEmbarque = ${campos.fkLocalEmbarque === null ? 'NULL' : campos.fkLocalEmbarque}`);

    if (updates.length === 0) {
        return Promise.reject(new Error("Nenhum campo para atualizar"));
    }

    var instrucao = `
        UPDATE reclamacao
        SET ${updates.join(", ")}
        WHERE idReclamacao = ${id};
    `;
    return database.executar(instrucao);
}

function deletar(id) {
    var instrucao = `
        DELETE FROM comentarios WHERE fkReclamacao = ${id};
    `;
    // primeiro deletar comentários relacionados (caso existam) e depois a reclamação
    return database.executar(instrucao)
        .then(() => {
            var instr = `DELETE FROM reclamacao WHERE idReclamacao = ${id};`;
            return database.executar(instr);
        });
}

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
            u.nivel_acesso AS usuarioNivel
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
            u.nivel_acesso AS usuarioNivel
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
    listar,
    listarPorUsuario,
    buscarPorId,
    inserir,
    editar,
    deletar,
    listarTodas,
    listarPorId,
    atualizarStatus
};