var express = require("express");
var router = express.Router();
var reclamacaoController = require("../controllers/reclamacaoController");

router.get("/listar", reclamacaoController.listar);
router.delete("/deletar/:id", reclamacaoController.deletar);
router.put("/editar/:id", reclamacaoController.editar);
router.post("/criar", reclamacaoController.criar);
router.get("/buscar/:id", reclamacaoController.buscarPorId); 

module.exports = router;
