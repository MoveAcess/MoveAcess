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

function listar(req, res) {
    // se vier ?usuarioId=... então listar só desse usuário
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

function deletar(req, res) {
    var id = req.params.id;
    if (!id) {
        res.status(400).send("Id da reclamação não informado");
        return;
    }

    reclamacaoModel.deletar(id)
        .then(resultado => res.json({ message: "Reclamação excluída" }))
        .catch(erro => {
            console.log("Erro ao excluir reclamação:", erro);
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
        .then(resultado => res.json({ message: "Reclamação atualizada" }))
        .catch(erro => {
            console.log("Erro ao editar reclamação:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function criar(req, res) {
    // criar nova reclamação (disponível para usuários comuns)
    var reclamacao = {
        statusReclamacao: req.body.statusReclamacao || "Pendente",
        tipo: req.body.tipo,
        descricao: req.body.descricao,
        dataHoraCriacao: req.body.dataHoraCriacao, // opcional
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


module.exports = {
    listarTodas,
    listarPorId,
    atualizarStatus,
    listar,
    deletar,
    editar,
    criar,


// exporto também buscarPorId caso precise
    buscarPorId: function (req, res) {
        var id = req.params.id;
        reclamacaoModel.buscarPorId(id)
            .then(resultado => {
                if (resultado.length > 0) res.json(resultado[0]);
                else res.status(404).send("Reclamação não encontrada");
            })
            .catch(erro => {
                console.log("Erro ao buscar reclamação:", erro);
                res.status(500).json(erro.sqlMessage || erro);
            });
    }
};
