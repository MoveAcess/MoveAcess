var reclamacaoModel = require("../models/reclamacaoModel");
var comentarioModel = require("../models/comentarioModel"); // se existe, usado em buscarPorId

function listar(req, res) {
    var usuarioId = req.query.usuarioId;

    var promessa;
    if (usuarioId) {
        promessa = reclamacaoModel.listarPorUsuario(usuarioId);
    } else {
        promessa = reclamacaoModel.listar();
    }

    promessa
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao listar reclamações:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function buscarPorId(req, res) {
    var id = req.params.id;
    if (!id) {
        res.status(400).send("Id da reclamação não informado");
        return;
    }

    reclamacaoModel.buscarPorId(id)
        .then(async resultado => {
            if (resultado.length === 0) {
                res.status(404).send("Reclamação não encontrada");
                return;
            }

            // se houver comentárioModel disponível, anexa comentários
            if (comentarioModel && comentarioModel.listarComentariosDaReclamacao) {
                try {
                    var comentarios = await comentarioModel.listarComentariosDaReclamacao(id);
                    resultado[0].comentarios = comentarios;
                } catch (e) {
                    console.log("Não foi possível carregar comentários:", e);
                }
            }

            res.json(resultado[0]);
        })
        .catch(erro => {
            console.log("Erro ao buscar reclamação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function criar(req, res) {
    var reclamacao = {
        statusReclamacao: req.body.statusReclamacao || "Pendente",
        tipo: req.body.tipo,
        descricao: req.body.descricao,
        dataHoraCriacao: req.body.dataHoraCriacao,
        fkVeiculo: req.body.fkVeiculo || null,
        fkLocalEmbarque: req.body.fkLocalEmbarque || null,
        fkUsuario: req.body.fkUsuario
    };

    if (!reclamacao.tipo || !reclamacao.descricao || !reclamacao.fkUsuario) {
        res.status(400).send("Campos obrigatórios: tipo, descricao, fkUsuario");
        return;
    }

    reclamacaoModel.inserir(reclamacao)
        .then(resultado => res.status(201).json({ message: "Reclamação criada", id: resultado.insertId }))
        .catch(erro => {
            console.log("Erro ao criar reclamação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function editar(req, res) {
    var id = req.params.id;
    var campos = {};

    if (req.body.statusReclamacao !== undefined) campos.statusReclamacao = req.body.statusReclamacao;
    if (req.body.descricao !== undefined) campos.descricao = req.body.descricao;
    if (req.body.dataHoraResolucao !== undefined) campos.dataHoraResolucao = req.body.dataHoraResolucao;
    if (req.body.fkVeiculo !== undefined) campos.fkVeiculo = req.body.fkVeiculo;
    if (req.body.fkLocalEmbarque !== undefined) campos.fkLocalEmbarque = req.body.fkLocalEmbarque;

    if (!id) {
        res.status(400).send("Id da reclamação não informado");
        return;
    }

    reclamacaoModel.editar(id, campos)
        .then(() => res.json({ message: "Reclamação atualizada" }))
        .catch(erro => {
            console.log("Erro ao editar reclamação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function deletar(req, res) {
    var id = req.params.id;
    if (!id) {
        res.status(400).send("Id da reclamação não informado");
        return;
    }

    reclamacaoModel.deletar(id)
        .then(() => res.json({ message: "Reclamação excluída" }))
        .catch(erro => {
            console.log("Erro ao excluir reclamação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    editar,
    deletar
};
