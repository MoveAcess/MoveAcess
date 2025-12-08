script-tabelas.sql

create database moveacess;

use moveacess;

create table veiculo (
idVeiculo int primary key auto_increment,
tipoTransporte varchar(45),
tipoVeiculo varchar(45),
statusAcessibilidade varchar(45)
);

create table localEmbarque (
idLocal int primary key auto_increment,
nome varchar(45),
municipio varchar(45),
linha_frota varchar(45),
endereco varchar(45)
);

create table registro_logs (
idLogs int primary key auto_increment,
horaInicioProcesso datetime,
horaEncerramentoProcesso datetime,
qtdErros int
);

create table usuario (
idUsuario int primary key auto_increment,
nome varchar(45),
nivel_acesso int not null,
email varchar(100) unique not null,
senha varchar(45),
constraint chkNivel check (nivel_acesso in(1,2,3))
);

create table reclamacao (
idReclamacao int primary key auto_increment,
statusReclamacao enum("Pendente", "Em andamento", "Resolvido") not null,
tipo varchar(45),
descricao varchar(100),
dataHoraCriacao datetime,
dataHoraResolucao datetime,
fkVeiculo int null,
fkLocalEmbarque int null, 
fkUsuario int not null,
foreign key (fkVeiculo) references veiculo (idVeiculo),
foreign key (fkLocalEmbarque) references localEmbarque (idLocal),
foreign key (fkUsuario) references usuario (idUsuario),
constraint chk_fk check 
(fkVeiculo is not null or fkLocalEmbarque is not null)
);

create table comentarios (
idComentario int primary key auto_increment,
dataHoraComentario datetime,
comentario varchar(300),
fkReclamacao int,
fkUsuario int,
foreign key (fkReclamacao) references reclamacao(idReclamacao),
foreign key (fkUsuario) references usuario(idUsuario)
);

select * from usuario;

INSERT INTO usuario (nivel_acesso, email, senha)
VALUES 
(1, 'bia@gmail.com', '1234');

INSERT INTO veiculo (tipoTransporte, tipoVeiculo, statusAcessibilidade)
VALUES
('Ônibus', 'Ônibus Urbano', 'Acessível'),
('Ônibus', 'Micro-Ônibus', 'Parcialmente acessível'),
('Ônibus', 'BRT', 'Acessível'),
('Trem', 'CPTM Linha 9', 'Acessível'),
('Metrô', 'Linha Amarela', 'Acessível'),
('Metrô', 'Linha Vermelha', 'Parcialmente acessível'),
('VLT', 'VLT Baixada Santista', 'Acessível'),
('Ônibus', 'Ônibus Urbano', 'Não acessível');

INSERT INTO localEmbarque (nome, municipio, linha_frota, endereco)
VALUES
('Terminal Santo Amaro', 'São Paulo', 'Ônibus – Linhas 695T, 6701, 5119', 'Av. Padre José Maria, 300'),
('Estação Luz', 'São Paulo', 'Metrô – Linha Azul / CPTM', 'Praça da Luz, 1'),
('Terminal Barra Funda', 'São Paulo', 'Ônibus – Linhas Intermunicipais', 'Rua Bento Teobaldo Ferraz, 119'),
('Estação Sé', 'São Paulo', 'Metrô – Linhas Azul e Vermelha', 'Praça da Sé, s/n'),
('Terminal Jabaquara', 'São Paulo', 'Ônibus – Intermunicipal', 'Rua dos Jequitibás, 20'),
('Ponto Avenida Paulista', 'São Paulo', 'Ônibus – Linhas 875A, 875P', 'Av. Paulista, 1578'),
('Estação Vila Prudente', 'São Paulo', 'Metrô – Linha Verde', 'Av. Anhaia Mello, 1000'),
('Terminal Diadema', 'Diadema', 'Ônibus – EMTU BRT10', 'Av. Doutor Ulysses Guimarães, 200');


INSERT INTO reclamacao 
(statusReclamacao, tipo, descricao, dataHoraCriacao, dataHoraResolucao, fkVeiculo, fkLocalEmbarque, fkUsuario)
VALUES
("Pendente", "Elevador Inoperante", "Elevador principal fora de operação há 3 dias", "2024-04-20 08:30:00", NULL, 1, 1, 1),

("Em andamento", "Rampa de Acesso", "Rampa com inclinação irregular", "2024-04-20 07:45:00", NULL, 1, 1, 1),

("Pendente", "Ônibus sem Acessibilidade", "Veículo sem rampa automática", "2024-04-20 06:20:00", NULL, 1, 1, 1),

("Em andamento", "Piso Tátil Danificado", "Piso tátil com várias peças soltas", "2024-04-20 05:15:00", NULL, 1, 1, 1),

("Pendente", "Elevador Inoperante", "Elevador com portas travadas", "2024-04-20 04:30:00", NULL, 1, 1, 1),

("Resolvido", "Atendimento", "Falta de funcionário capacitado", "2024-04-20 03:45:00", "2024-04-20 03:45:00", 1, 1, 1),

("Em andamento", "Ônibus sem Acessibilidade", "Plataforma elevatória com defeito", "2024-04-20 02:20:00", NULL, 1, 1, 1),

("Pendente", "Sinalização", "Placas de sinalização em Braille ilegíveis", "2024-04-20 01:15:00", NULL, 1, 1, 1);

select * from reclamacao;
select * from comentarios;


-- Atualizar o usuário existente com um nome
UPDATE usuario 
SET nome = 'Beatriz' 
WHERE email = 'bia@gmail.com';

-- Verificar a alteração
SELECT * FROM usuario;




-- ==================== CRIAR NOVOS USUÁRIOS ====================

-- Usuário Admin nível 2
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('Carlos Silva', 2, 'carlos@admin.com', 'admin123');

-- Usuário comum nível 3
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('Maria Santos', 3, 'maria@gmail.com', 'senha123');

-- Outro usuário comum nível 3
INSERT INTO usuario (nome, nivel_acesso, email, senha)
VALUES ('João Oliveira', 3, 'joao@gmail.com', 'joao456');


-- Verificar usuários criados
SELECT * FROM usuario;

-- ==================== CRIAR COMENTÁRIOS NA RECLAMAÇÃO 1 ====================

-- Comentário da Beatriz (ID 1) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 1, 'Reportei este problema há 3 dias. A situação está crítica para cadeirantes.', NOW());

-- Comentário do Carlos (ID 2 - Admin) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 2, 'Obrigado pelo relato. Já acionamos a equipe de manutenção para verificar o elevador.', NOW());

-- Comentário da Maria (ID 3) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 3, 'Também tive problemas no elevador ontem. É urgente a resolução!', NOW());

-- Comentário do João (ID 4) na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 4, 'Vi que colocaram uma placa de "Em Manutenção" hoje cedo. Esperamos que resolvam logo.', NOW());

-- Comentário do Admin Carlos atualizando na reclamação 1
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (1, 2, 'ATUALIZAÇÃO: Técnico chegou às 14h. Previsão de conclusão: 48h.', NOW());

-- ==================== COMENTÁRIOS EM OUTRAS RECLAMAÇÕES ====================

-- Comentários na reclamação 2 (Rampa de Acesso)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (2, 3, 'A rampa está muito íngreme, dificulta muito o acesso.', NOW());

INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (2, 2, 'Já enviamos a solicitação para adequação conforme norma ABNT NBR 9050.', NOW());

-- Comentários na reclamação 3 (Ônibus sem Acessibilidade)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (3, 4, 'Peguei este ônibus e realmente a rampa não funciona.', NOW());

INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (3, 1, 'Precisamos identificar o número do veículo para reportar à empresa.', NOW());

-- Comentários na reclamação 4 (Piso Tátil)
INSERT INTO comentarios (fkReclamacao, fkUsuario, comentario, dataHoraComentario)
VALUES (4, 3, 'Várias peças soltas na área próxima à catraca. Risco de queda!', NOW());

-- Inserir estações na tabela localEmbarque
INSERT INTO localEmbarque (nome, municipio, linha_frota, endereco) VALUES
('Aeroporto - Guarulhos', 'Guarulhos', '13', 'Aeroporto Internacional'),
('Água Branca', 'São Paulo', '7', 'Av. Santa Marina'),
('Antonio Gianetti Neto', 'São Paulo', '11', 'Av. Antonio Gianetti Neto'),
('Aracaré', 'São Paulo', '12', 'Rua Aracaré'),
('Baltazar Fidélis', 'São Paulo', '7', 'Rua Baltazar Fidélis'),
('Botujuru', 'São Paulo', '7', 'Estação Botujuru'),
('Brás', 'São Paulo', '7 | 10 | 11 | 12', 'Praça Agente Cícero'),
('Braz Cubas', 'Mogi das Cruzes', '11', 'Av. Braz Cubas'),
('Caieiras', 'Caieiras', '7', 'Estação Caieiras'),
('Campo Limpo Paulista', 'Campo Limpo Paulista', '7', 'Estação Campo Limpo'),
('Vila Aurora', 'São Paulo', '7', 'Av. Vila Aurora');

-- Inserir veículos na tabela veiculo
INSERT INTO veiculo (tipoTransporte, tipoVeiculo, statusAcessibilidade) VALUES
('Trem/Metrô', 'Linha 13', 'Totalmente Acessível'),
('Trem/Metrô', 'Linha 13', 'Parcialmente Acessível'),
('Trem/Metrô', 'Linha 7', 'Totalmente Acessível'),
('Trem/Metrô', 'Linha 7', 'Parcialmente Acessível'),
('Trem/Metrô', 'Linha 12', 'Totalmente Acessível'),
('Trem/Metrô', 'Linha 12', 'Parcialmente Acessível'),
('Trem/Metrô', 'Linha 12', 'Em Adaptação'),
('Trem/Metrô', 'Linha 12 | 13', 'Totalmente Acessível'),
('Trem/Metrô', 'Linha 12 | 13', 'Parcialmente Acessível'),
('Trem/Metrô', 'Linha 12 | 13', 'Em Adaptação');

-- Adicionar mais veículos para ter dados suficientes
INSERT INTO veiculo (tipoTransporte, tipoVeiculo, statusAcessibilidade) VALUES
('Ônibus', 'Ônibus Urbano', 'Acessível'),
('Ônibus', 'Ônibus Urbano', 'Acessível'),
('Ônibus', 'Ônibus Urbano', 'Acessível'),
('Ônibus', 'Ônibus Urbano', 'Parcialmente acessível'),
('Ônibus', 'Ônibus Urbano', 'Parcialmente acessível'),
('Ônibus', 'Ônibus Urbano', 'Não acessível'),
('Ônibus', 'Micro-Ônibus', 'Acessível'),
('Ônibus', 'Micro-Ônibus', 'Parcialmente acessível'),
('Metrô', 'Linha Azul', 'Acessível'),
('Metrô', 'Linha Vermelha', 'Parcialmente acessível');
