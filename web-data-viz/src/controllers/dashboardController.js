var dashboardModel = require("../models/dashboardModel");

function obterMetricas(req, res) {
    console.log("CONTROLLER - obterMetricas");
    
    dashboardModel.obterMetricas()
        .then(function (resultado) {
            if (resultado.length > 0) {
                const dados = resultado[0];
                
                console.log("Dados REAIS do banco:", dados);
                
                // Calcular variações baseadas nos dados REAIS
                const variacaoFrotaPercentual = dados.veiculos_acessiveis_atuais - dados.veiculos_acessiveis_anteriores;
                const variacaoElevadores = dados.elevadores_inoperantes_anteriores - dados.elevadores_inoperantes;
                const percentualVariacaoElevadores = dados.elevadores_inoperantes_anteriores > 0 ? 
                    Math.round((variacaoElevadores / dados.elevadores_inoperantes_anteriores) * 100) : 0;
                
                const variacaoVeiculos = dados.total_veiculos - dados.veiculos_operando_anteriores;
                
                const responseData = {
                    // Card 1: Ônibus Acessíveis - DADOS REAIS
                    frota_acessivel: dados.percentual_acessivel + '%',
                    variacao_frota: variacaoFrotaPercentual > 0 ? `+${variacaoFrotaPercentual}%` : `${variacaoFrotaPercentual}%`,
                    
                    // Card 2: Elevadores Inoperantes - DADOS REAIS
                    elevadores_inoperantes: dados.elevadores_inoperantes,
                    variacao_elevadores: percentualVariacaoElevadores > 0 ? 
                        `-${percentualVariacaoElevadores}%` : `+${Math.abs(percentualVariacaoElevadores)}%`,
                    
                    // Card 3: Reclamações Registradas - DADOS REAIS
                    reclamacoes_registradas: dados.reclamacoes_30_dias,
                    
                    // Card 4: Frota Acessível - DADOS REAIS
                    veiculos_operando: dados.total_veiculos,
                    variacao_veiculos: variacaoVeiculos > 0 ? `+${variacaoVeiculos}` : `${variacaoVeiculos}`,
                    
                    // Gráfico de evolução - DADOS REAIS
                    evolucao_acessibilidade: [
                        dados.evolucao_2019,
                        dados.evolucao_2020,
                        dados.evolucao_2021,
                        dados.evolucao_2022,
                        dados.evolucao_2023,
                        dados.evolucao_2024
                    ],
                    
                    // Gráfico de distribuição - DADOS REAIS
                    distribuicao_acessibilidade: [
                        dados.totalmente_acessivel,
                        dados.parcialmente_acessivel,
                        dados.nao_acessivel,
                        dados.em_adaptacao
                    ]
                };
                
                console.log("Dados processados (REAIS):", responseData);
                res.status(200).json(responseData);
                
            } else {
                console.log("Nenhum dado REAL encontrado");
                res.status(500).json({ error: "Não foi possível carregar os dados do dashboard" });
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar métricas REAIS:", erro);
            res.status(500).json({ error: "Erro ao carregar dados do dashboard: " + erro.sqlMessage });
        });
}

module.exports = {
    obterMetricas
};