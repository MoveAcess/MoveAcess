var express = require("express");
var router = express.Router();

var reclamacaoController = require("../controllers/reclamacaoController");
var comentarioController = require("../controllers/comentarioController");

// ==================== ROTAS DE RECLAMAÇÕES ====================
router.get("/", function (req, res) {
    reclamacaoController.listarTodas(req, res);
});

router.get("/:id", function (req, res) {
    reclamacaoController.listarPorId(req, res);
});

router.put("/:id/status", function (req, res) {
    reclamacaoController.atualizarStatus(req, res);
});

// ==================== ROTAS DE COMENTÁRIOS ====================

// LISTAR comentários de uma reclamação
router.get("/:id/comentarios", function (req, res) {
    comentarioController.listar(req, res);
});

// CRIAR novo comentário
router.post("/:id/comentarios", function (req, res) {
    comentarioController.criar(req, res);
});

// ATUALIZAR comentário existente
router.put("/comentarios/:id", function (req, res) {
    comentarioController.atualizar(req, res);
});

// DELETAR comentário
router.delete("/comentarios/:id", function (req, res) {
    comentarioController.deletar(req, res);
});

module.exports = router;