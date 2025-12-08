var express = require("express");
var router = express.Router();

var reclamacaoUserController = require("../controllers/reclamacaoUserController");

// Listar todas as reclamações de um usuário
router.get("/listar/:idUsuario", function (req, res) {
    reclamacaoUserController.listarReclamacoesUser(req, res);
});

// Buscar uma reclamação específica por ID
router.get("/buscar/:idReclamacao", function (req, res) {
    reclamacaoUserController.buscarReclamacaoPorId(req, res);
});

// Listar veículos disponíveis
router.get("/veiculos", function (req, res) {
    reclamacaoUserController.listarVeiculos(req, res);
});

// Listar locais de embarque disponíveis
router.get("/locais", function (req, res) {
    reclamacaoUserController.listarLocaisEmbarque(req, res);
});

// Criar nova reclamação
router.post("/criar/:idUsuario", function (req, res) {
    reclamacaoUserController.criarReclamacaoUser(req, res);
});

// Atualizar reclamação existente
router.put("/atualizar/:idReclamacao", function (req, res) {
    reclamacaoUserController.atualizarReclamacaoUser(req, res);
});

// Excluir reclamação
router.delete("/excluir/:idReclamacao", function (req, res) {
    reclamacaoUserController.excluirReclamacaoUser(req, res);
});

module.exports = router;