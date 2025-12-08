var reclamacaoUserModel = require("../models/reclamacaoUserModel");

// Função para escapar strings e prevenir SQL injection básico
function escaparSQL(valor) {
    if (typeof valor === 'string') {
        return valor
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
    }
    return valor;
}

function listarReclamacoesUser(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!idUsuario) {
        return res.status(400).json({
            mensagem: "ID do usuário é obrigatório"
        });
    }

    reclamacaoUserModel.listarReclamacoesUser(idUsuario)
        .then(function (resultado) {
            console.log(`Reclamações encontradas: ${resultado.length}`);

            // Formatar os dados para facilitar no frontend
            var reclamacoesFormatadas = resultado.map(rec => {
                // Montar descrição do veículo
                let veiculoInfo = null;
                if (rec.veiculoTipoTransporte) {
                    veiculoInfo = `${rec.veiculoTipoTransporte} - ${rec.veiculoTipo}`;
                    if (rec.veiculoAcessibilidade) {
                        veiculoInfo += ` (${rec.veiculoAcessibilidade})`;
                    }
                }

                // Montar descrição do local
                let localInfo = null;
                if (rec.localNome) {
                    localInfo = rec.localNome;
                    if (rec.localMunicipio) {
                        localInfo += ` - ${rec.localMunicipio}`;
                    }
                    if (rec.localLinha) {
                        localInfo += ` (${rec.localLinha})`;
                    }
                }

                return {
                    idReclamacao: rec.idReclamacao,
                    status: rec.statusReclamacao,
                    tipo: rec.tipo,
                    descricao: rec.descricao,
                    dataHoraCriacao: rec.dataHoraCriacao,
                    dataHoraResolucao: rec.dataHoraResolucao,
                    veiculo: veiculoInfo,
                    local: localInfo,
                    fkVeiculo: rec.fkVeiculo,
                    fkLocalEmbarque: rec.fkLocalEmbarque
                };
            });

            if (reclamacoesFormatadas.length === 0) {
                return res.status(200).json({
                    mensagem: "Sem reclamações ainda",
                    dados: []
                });
            }

            res.status(200).json({
                mensagem: "Reclamações encontradas com sucesso",
                dados: reclamacoesFormatadas
            });

        }).catch(function (erro) {
            console.error("Erro ao listar reclamações: ", erro);
            res.status(500).json({
                mensagem: "Erro ao listar reclamações",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function criarReclamacaoUser(req, res) {
    var idUsuario = req.params.idUsuario;
    var tipo = escaparSQL(req.body.tipo);
    var descricao = escaparSQL(req.body.descricao);
    var fkVeiculo = req.body.fkVeiculo || null;
    var fkLocalEmbarque = req.body.fkLocalEmbarque || null;
    var statusReclamacao = req.body.statusReclamacao || "Pendente";

    // Validações
    if (!idUsuario) {
        return res.status(400).json({
            mensagem: "ID do usuário é obrigatório"
        });
    }

    if (!tipo || !descricao) {
        return res.status(400).json({
            mensagem: "Tipo e descrição são obrigatórios"
        });
    }

    // Validar que pelo menos um FK foi fornecido
    if (!fkVeiculo && !fkLocalEmbarque) {
        return res.status(400).json({
            mensagem: "É necessário informar um veículo ou local de embarque"
        });
    }

    // Validar status
    var statusValidos = ["Pendente", "Em andamento", "Resolvido"];
    if (!statusValidos.includes(statusReclamacao)) {
        return res.status(400).json({
            mensagem: "Status inválido. Deve ser: Pendente, Em andamento ou Resolvido"
        });
    }

    if (descricao.length > 100) {
        return res.status(400).json({
            mensagem: "Descrição não pode ter mais de 100 caracteres"
        });
    }

    reclamacaoUserModel.criarReclamacaoUser(idUsuario, tipo, descricao, fkVeiculo, fkLocalEmbarque, statusReclamacao)
        .then(function (resultado) {
            res.status(201).json({
                mensagem: "Reclamação criada com sucesso",
                idReclamacao: resultado.insertId
            });
        }).catch(function (erro) {
            console.error("Erro ao criar reclamação: ", erro);
            res.status(500).json({
                mensagem: "Erro ao criar reclamação",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function excluirReclamacaoUser(req, res) {
    var idReclamacao = req.params.idReclamacao;

    if (!idReclamacao) {
        return res.status(400).json({
            mensagem: "ID da reclamação é obrigatório"
        });
    }

    reclamacaoUserModel.buscarReclamacaoPorId(idReclamacao)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).json({
                    mensagem: "Reclamação não encontrada"
                });
            }

            return reclamacaoUserModel.excluirReclamacaoUser(idReclamacao);
        })
        .then(function (resultado) {
            if (resultado) {
                res.status(200).json({
                    mensagem: "Reclamação excluída com sucesso"
                });
            }
        })
        .catch(function (erro) {
            console.error("Erro ao excluir reclamação: ", erro);
            res.status(500).json({
                mensagem: "Erro ao excluir reclamação",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function buscarReclamacaoPorId(req, res) {
    var idReclamacao = req.params.idReclamacao;

    if (!idReclamacao) {
        return res.status(400).json({
            mensagem: "ID da reclamação é obrigatório"
        });
    }

    reclamacaoUserModel.buscarReclamacaoPorId(idReclamacao)
        .then(function (resultado) {
            if (resultado.length === 0) {
                return res.status(404).json({
                    mensagem: "Reclamação não encontrada"
                });
            }

            var rec = resultado[0];
            
            // Montar descrição do veículo
            let veiculoInfo = null;
            if (rec.veiculoTipoTransporte) {
                veiculoInfo = `${rec.veiculoTipoTransporte} - ${rec.veiculoTipo}`;
                if (rec.veiculoAcessibilidade) {
                    veiculoInfo += ` (${rec.veiculoAcessibilidade})`;
                }
            }

            // Montar descrição do local
            let localInfo = null;
            if (rec.localNome) {
                localInfo = rec.localNome;
                if (rec.localMunicipio) {
                    localInfo += ` - ${rec.localMunicipio}`;
                }
                if (rec.localLinha) {
                    localInfo += ` (${rec.localLinha})`;
                }
            }
            
            var reclamacaoFormatada = {
                idReclamacao: rec.idReclamacao,
                status: rec.statusReclamacao,
                tipo: rec.tipo,
                descricao: rec.descricao,
                dataHoraCriacao: rec.dataHoraCriacao,
                dataHoraResolucao: rec.dataHoraResolucao,
                veiculo: veiculoInfo,
                local: localInfo,
                fkVeiculo: rec.fkVeiculo,
                fkLocalEmbarque: rec.fkLocalEmbarque
            };

            res.status(200).json({
                mensagem: "Reclamação encontrada",
                dados: reclamacaoFormatada
            });
        })
        .catch(function (erro) {
            console.error("Erro ao buscar reclamação: ", erro);
            res.status(500).json({
                mensagem: "Erro ao buscar reclamação",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function atualizarReclamacaoUser(req, res) {
    var idReclamacao = req.params.idReclamacao;
    var tipo = escaparSQL(req.body.tipo);
    var descricao = escaparSQL(req.body.descricao);
    var statusReclamacao = req.body.statusReclamacao;
    var fkVeiculo = req.body.fkVeiculo || null;
    var fkLocalEmbarque = req.body.fkLocalEmbarque || null;

    if (!idReclamacao) {
        return res.status(400).json({
            mensagem: "ID da reclamação é obrigatório"
        });
    }

    if (!tipo || !descricao || !statusReclamacao) {
        return res.status(400).json({
            mensagem: "Tipo, descrição e status são obrigatórios"
        });
    }

    if (!fkVeiculo && !fkLocalEmbarque) {
        return res.status(400).json({
            mensagem: "É necessário informar um veículo ou local de embarque"
        });
    }

    var statusValidos = ["Pendente", "Em andamento", "Resolvido"];
    if (!statusValidos.includes(statusReclamacao)) {
        return res.status(400).json({
            mensagem: "Status inválido. Deve ser: Pendente, Em andamento ou Resolvido"
        });
    }

    reclamacaoUserModel.atualizarReclamacaoUser(idReclamacao, tipo, descricao, statusReclamacao, fkVeiculo, fkLocalEmbarque)
        .then(function (resultado) {
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensagem: "Reclamação não encontrada"
                });
            }

            res.status(200).json({
                mensagem: "Reclamação atualizada com sucesso"
            });
        })
        .catch(function (erro) {
            console.error("Erro ao atualizar reclamação: ", erro);
            res.status(500).json({
                mensagem: "Erro ao atualizar reclamação",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function listarVeiculos(req, res) {
    reclamacaoUserModel.listarVeiculos()
        .then(function (resultado) {
            res.status(200).json({
                mensagem: "Veículos encontrados",
                dados: resultado
            });
        })
        .catch(function (erro) {
            console.error("Erro ao listar veículos: ", erro);
            res.status(500).json({
                mensagem: "Erro ao listar veículos",
                erro: erro.sqlMessage || erro.message
            });
        });
}

function listarLocaisEmbarque(req, res) {
    reclamacaoUserModel.listarLocaisEmbarque()
        .then(function (resultado) {
            res.status(200).json({
                mensagem: "Locais de embarque encontrados",
                dados: resultado
            });
        })
        .catch(function (erro) {
            console.error("Erro ao listar locais: ", erro);
            res.status(500).json({
                mensagem: "Erro ao listar locais",
                erro: erro.sqlMessage || erro.message
            });
        });
}

module.exports = {
    listarReclamacoesUser,
    criarReclamacaoUser,
    excluirReclamacaoUser,
    buscarReclamacaoPorId,
    atualizarReclamacaoUser,
    listarVeiculos,
    listarLocaisEmbarque
};