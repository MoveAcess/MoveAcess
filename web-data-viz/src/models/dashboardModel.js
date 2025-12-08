var database = require("../database/config")

function obterMetricas() {
    console.log("ACESSEI O DASHBOARD MODEL - obterMetricas");
    
    var instrucaoSql = `
        SELECT 
            -- Frota acessível: percentual de veículos acessíveis
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo), 0) as percentual_acessivel,
                  
            -- Variação da frota (simulada com dados anteriores)
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') as veiculos_acessiveis_atuais,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') - 2 as veiculos_acessiveis_anteriores,
            
            -- Elevadores inoperantes: baseado em reclamações
            (SELECT COUNT(*) FROM reclamacao 
             WHERE (tipo LIKE '%Elevador%' OR tipo LIKE '%elevador%') 
             AND statusReclamacao IN ('Pendente', 'Em andamento')) as elevadores_inoperantes,
             
            -- Variação de elevadores (simulada)
            (SELECT COUNT(*) FROM reclamacao 
             WHERE (tipo LIKE '%Elevador%' OR tipo LIKE '%elevador%') 
             AND statusReclamacao IN ('Pendente', 'Em andamento')) - 2 as elevadores_inoperantes_anteriores,
            
            -- Reclamações registradas (últimos 30 dias)
            (SELECT COUNT(*) FROM reclamacao WHERE dataHoraCriacao >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as reclamacoes_30_dias,
            
            -- Frota operando: total de veículos
            (SELECT COUNT(*) FROM veiculo) as total_veiculos,
            
            -- Variação da frota operando (simulada)
            (SELECT COUNT(*) FROM veiculo) - 3 as veiculos_operando_anteriores,
            
            -- Evolução da acessibilidade (simulada com crescimento progressivo)
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo) * 0.5, 0) as evolucao_2019,
                  
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo) * 0.6, 0) as evolucao_2020,
                  
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo) * 0.7, 0) as evolucao_2021,
                  
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo) * 0.8, 0) as evolucao_2022,
                  
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo) * 0.9, 0) as evolucao_2023,
                  
            ROUND((SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') * 100.0 / 
                  (SELECT COUNT(*) FROM veiculo), 0) as evolucao_2024,
            
            -- Distribuição por nível de acessibilidade
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Acessível') as totalmente_acessivel,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Parcialmente acessível') as parcialmente_acessivel,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade = 'Não acessível') as nao_acessivel,
            (SELECT COUNT(*) FROM veiculo WHERE statusAcessibilidade LIKE '%Adaptação%') as em_adaptacao;
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    obterMetricas
};