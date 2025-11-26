var ambiente_processo = 'producao';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var usuarioRouter = require("./src/routes/usuarios");

var reclamacoes = require("./src/routes/reclamacoes");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/reclamacoes", reclamacoes);

app.use(cors());

app.use("/usuarios", usuarioRouter);

app.listen(PORTA_APP, HOST_APP, () => {
  console.log(`Servidor rodando em http://${HOST_APP}:${PORTA_APP}`);
});
