var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// Cadastro de usuário
router.post("/cadastrar", (req, res) => {
    usuarioController.cadastrar(req, res);
});

// Login / autenticação
router.post("/autenticar", (req, res) => {
    usuarioController.autenticar(req, res);
});

// Visualizar um usuário por ID
router.get("/visualizar/:id", (req, res) => {
    usuarioController.visualizar(req, res);
});

// Deletar usuário por ID
router.delete("/deletar/:id", (req, res) => {
    usuarioController.deletar(req, res);
});

// Editar usuário por ID
router.put("/editar/:id", (req, res) => {
    usuarioController.editar(req, res);
});

module.exports = router;
