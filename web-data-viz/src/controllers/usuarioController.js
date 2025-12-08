var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
        return;
    }
    if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
        return;
    }
    usuarioModel.autenticar(email, senha)
        .then(function (resultado) {
            console.log(`Resultados encontrados: ${resultado.length}`);

            if (resultado.length == 1) {
                // não retornar senha ao front
                res.json({
                    idUsuario: resultado[0].idUsuario,
                    nome: resultado[0].nome,
                    email: resultado[0].email,
                    nivel_acesso: resultado[0].nivel_acesso
                });
            } else if (resultado.length == 0) {
                res.status(403).send("Email e/ou senha inválido(s)");
            } else {
                res.status(403).send("Mais de um usuário com o mesmo login e senha!");
            }
        }).catch(function (erro) {
            console.log("Erro ao autenticar:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });

}


function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var nivel_acesso = 3;

    // Faça as validações dos valores
    if (!nome) {
        res.status(400).send("Seu nome está undefined!");
        return;
    }
    if (!email) {
        res.status(400).send("Seu email está undefined!");
        return;
    }
    if (!senha) {
        res.status(400).send("Sua senha está undefined!");
        return;
    }
    if (email.includes('.gov')){
        nivel_acesso = 2;
    }

    usuarioModel.cadastrar(nome, email, senha, nivel_acesso)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro!", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function visualizar(req, res) {
    // aceitar id tanto por body quanto por query/params (mais robusto)
    var idUsuario = req.body.idServer || req.query.id || req.params.id;
    if (!idUsuario) {
        res.status(400).send("Id do usuário não informado");
        return;
    }
    usuarioModel.visualizar(idUsuario)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.json(resultado[0]);
            } else {
                res.status(404).send("Usuário não encontrado");
            }
        }).catch(function (erro) {
            console.log("Erro ao visualizar:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function deletar(req, res) {
    // aceitar id tanto por body quanto por params
    var idUsuario = req.body.idServer || req.params.id;
    if (!idUsuario) {
        res.status(400).send("Id do usuário não informado");
        return;
    }
    usuarioModel.deletar(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log("Houve um erro ao deletar o usuário:", erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

function editar(req, res) {
    var id = req.params.id;
    var nome = req.body.nome;
    var email = req.body.email;

    usuarioModel.editar(id, nome, email)
        .then(() => {
            res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });
        })
        .catch(erro => {
            console.log("Erro ao editar usuário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    autenticar,
    cadastrar,
    visualizar,
    deletar,
    editar
}