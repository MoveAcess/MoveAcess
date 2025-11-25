var comentarioModel = require("../models/comentarioModel");

function listar(req, res) {
    var idReclamacao = req.params.id;

    comentarioModel.listarComentariosDaReclamacao(idReclamacao)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao listar comentários:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function criar(req, res) {
    var idReclamacao = req.params.id;
    var idUsuario = req.body.idUsuario;
    var texto = req.body.texto;

    if (!texto) {
        res.status(400).send("Texto não enviado!");
        return;
    }

    comentarioModel.criarComentario(idReclamacao, idUsuario, texto)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao criar comentário:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizar(req, res) {
    var idComentario = req.params.id;
    var idUsuario = req.body.idUsuario;
    var texto = req.body.texto;

    comentarioModel.atualizarComentario(idComentario, idUsuario, texto)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao atualizar comentário:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function deletar(req, res) {
    var idComentario = req.params.id;
    var idUsuario = req.body.idUsuario;

    comentarioModel.deletarComentario(idComentario, idUsuario)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao deletar comentário:", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listar,
    criar,
    atualizar,
    deletar
};