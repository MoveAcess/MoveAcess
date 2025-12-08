var database = require("../database/config");

/* ===========================================================
   LISTAR RECLAMAÇÕES DO USUÁRIO
   =========================================================== */
function listarReclamacoesUser(idUsuario) {
    console.log("ACESSEI O RECLAMACAO USER MODEL - listarReclamacoesUser ->", idUsuario);

    var instrucao = `
        SELECT  
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            v.nome AS veiculoNome,
            l.nome AS localNome,
            r.fkUsuario
        FROM reclamacao r
        LEFT JOIN veiculo v ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l ON r.fkLocalEmbarque = l.idLocal
        WHERE r.fkUsuario = ?
        ORDER BY r.dataHoraCriacao DESC;

    `;

    console.log("Executando SQL:\n", instrucao);
    return database.executar(instrucao, [idUsuario]);
}

/* ===========================================================
   CRIAR RECLAMAÇÃO
   =========================================================== */
function criarReclamacaoUser(idUsuario, tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao) {
    console.log("ACESSEI O RECLAMACAO USER MODEL - criarReclamacaoUser ->", {
        idUsuario, tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao
    });

    var instrucao = `
        INSERT INTO reclamacao (
            statusReclamacao,
            tipo,
            descricao,
            dataHoraCriacao,
            fkVeiculo,
            fkLocalEmbarque,
            fkUsuario
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?);
    `;

    return database.executar(instrucao, [
        statusReclamacao,
        tipo,
        descricao,
        fkVeiculo || null,
        fkLocalEmbarque || null,
        idUsuario
    ]);
}

/* ===========================================================
   EXCLUIR RECLAMAÇÃO
   =========================================================== */
function excluirReclamacaoUser(idReclamacao) {
    console.log("ACESSEI O RECLAMACAO USER MODEL - excluirReclamacaoUser ->", idReclamacao);

    var instrucao = `
        DELETE FROM reclamacao
        WHERE idReclamacao = ?;
    `;

    return database.executar(instrucao, [idReclamacao]);
}

/* ===========================================================
   BUSCAR RECLAMAÇÃO POR ID
   =========================================================== */
function buscarReclamacaoPorId(idReclamacao) {
    console.log("ACESSEI O RECLAMACAO USER MODEL - buscarReclamacaoPorId ->", idReclamacao);

    var instrucao = `
        SELECT 
            r.idReclamacao,
            r.statusReclamacao,
            r.tipo,
            r.descricao,
            r.dataHoraCriacao,
            r.dataHoraResolucao,
            r.fkVeiculo,
            r.fkLocalEmbarque,
            r.fkUsuario,
            v.tipoTransporte,
            v.tipoVeiculo,
            v.statusAcessibilidade,
            l.nome AS nomeLocal,
            l.municipio,
            l.linha_frota,
            l.endereco
        FROM reclamacao r
        LEFT JOIN veiculo v 
            ON r.fkVeiculo = v.idVeiculo
        LEFT JOIN localEmbarque l 
            ON r.fkLocalEmbarque = l.idLocal
        WHERE r.idReclamacao = ?;
    `;

    return database.executar(instrucao, [idReclamacao]);
}

/* ===========================================================
   ATUALIZAR RECLAMAÇÃO
   =========================================================== */
function atualizarReclamacaoUser(idReclamacao, tipo, descricao, statusReclamacao, fkVeiculo, fkLocalEmbarque) {
    console.log("ACESSEI O RECLAMACAO USER MODEL - atualizarReclamacaoUser ->", {
        idReclamacao, tipo, descricao, statusReclamacao, fkVeiculo, fkLocalEmbarque
    });

    // Adiciona dataHoraResolucao se o status for Resolvido
    var extraCampo = statusReclamacao === "Resolvido" 
        ? ", dataHoraResolucao = NOW()" 
        : "";

    var instrucao = `
        UPDATE reclamacao
        SET 
            tipo = ?,
            descricao = ?,
            statusReclamacao = ?,
            fkVeiculo = ?,
            fkLocalEmbarque = ?
            ${extraCampo}
        WHERE idReclamacao = ?;
    `;

    return database.executar(instrucao, [
        tipo,
        descricao,
        statusReclamacao,
        fkVeiculo || null,
        fkLocalEmbarque || null,
        idReclamacao
    ]);
}

/* ===========================================================
   LISTAR VEÍCULOS
   =========================================================== */
function listarVeiculos() {
    var instrucao = `
        SELECT 
            idVeiculo,
            tipoTransporte,
            tipoVeiculo,
            statusAcessibilidade
        FROM veiculo
        ORDER BY tipoTransporte, tipoVeiculo;
    `;

    return database.executar(instrucao);
}

/* ===========================================================
   LISTAR LOCAIS DE EMBARQUE
   =========================================================== */
function listarLocaisEmbarque() {
    var instrucao = `
        SELECT 
            idLocal,
            nome,
            municipio,
            linha_frota,
            endereco
        FROM localEmbarque
        ORDER BY nome;
    `;

    return database.executar(instrucao);
}

module.exports = {
    listarReclamacoesUser,
    criarReclamacaoUser,
    excluirReclamacaoUser,
    buscarReclamacaoPorId,
    atualizarReclamacaoUser,
    listarVeiculos,
    listarLocaisEmbarque
};
