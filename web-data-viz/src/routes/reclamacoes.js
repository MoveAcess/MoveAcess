var express = require("express");
var router = express.Router();
var reclamacaoController = require("../controllers/reclamacaoController");

router.get("/listar", reclamacaoController.listar); // /reclamacoes/listar or /reclamacoes/listar?usuarioId=#
router.get("/buscar/:id", reclamacaoController.buscarPorId);
router.post("/criar", reclamacaoController.criar);
router.put("/editar/:id", reclamacaoController.editar);
router.delete("/deletar/:id", reclamacaoController.deletar);

module.exports = router;
