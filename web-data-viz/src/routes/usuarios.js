var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", usuarioController.cadastrar);
router.post("/autenticar", usuarioController.autenticar);

// visualizar com :id (GET) e também aceita query/body via controller
router.get("/visualizar/:id", usuarioController.visualizar);
router.get("/visualizar", usuarioController.visualizar);

router.delete("/admin/deletar/:id", usuarioController.deletar);
router.delete("/deletar/:id", usuarioController.deletar);
router.put("/editar/:id", usuarioController.editar);

module.exports = router;
