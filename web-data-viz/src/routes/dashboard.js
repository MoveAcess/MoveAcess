var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/obterMetricas", function (req, res) {
    dashboardController.obterMetricas(req, res);
});

module.exports = router;