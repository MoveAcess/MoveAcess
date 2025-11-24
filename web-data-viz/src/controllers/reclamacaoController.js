var reclamacaoModel = require("../models/reclamacaoModel");
var comentarioModel = require("../models/comentarioModel");

function listarTodas(req, res) {
    reclamacaoModel.listarTodas()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao listar reclamações:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarPorId(req, res) {
    var id = req.params.id;

    reclamacaoModel.listarPorId(id)
        .then(async resultado => {
            if (resultado.length === 0) {
                res.status(404).send("Reclamação não encontrada.");
                return;
            }

            const comentarios = await comentarioModel.listarComentariosDaReclamacao(id);
            resultado[0].comentarios = comentarios;

            res.json(resultado[0]);
        })
        .catch(erro => {
            console.log("Erro ao buscar reclamação:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarStatus(req, res) {
    var id = req.params.id;
    var novoStatus = req.body.status;

    console.log("=== DEBUG atualizarStatus ===");
    console.log("ID:", id);
    console.log("Novo Status:", novoStatus);
    console.log("Body:", req.body);

    if (!novoStatus) {
        res.status(400).send("Status não enviado!");
        return;
    }

    reclamacaoModel.atualizarStatus(id, novoStatus)
        .then(resultado => {
            console.log("UPDATE OK:", resultado);
            res.json({ sucesso: true, resultado: resultado });
        })
        .catch(erro => {
            console.log("ERRO SQL:", erro);
            res.status(500).json({ erro: erro.sqlMessage || erro.message });
        });
}

module.exports = {
    listarTodas,
    listarPorId,
    atualizarStatus
};
