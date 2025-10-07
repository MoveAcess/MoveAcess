CREATE DATABASE moveacess;
USE moveacess;

CREATE TABLE prefeitura(
	idPrefeitura INT AUTO_INCREMENT PRIMARY KEY,
	nomeFantasia VARCHAR(45),
	cnpj CHAR(14)
);

CREATE TABLE usuario (
	idUsuario INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(45),
	email VARCHAR(100),
	senha VARCHAR(32),
	telefone CHAR(11),
	cpf CHAR(11),
	nivel_acesso INT,
	pcd BOOLEAN,
	descricaoDeficiencia VARCHAR(100),
	fkPrefeitura INT,
	FOREIGN KEY (fkPrefeitura) REFERENCES prefeitura(idPrefeitura)
);

CREATE TABLE endereco (
	idEndereco INT AUTO_INCREMENT PRIMARY KEY,
	cep CHAR(8),
	logradouro VARCHAR(100),
	numero INT,
	bairro VARCHAR(45),
	cidade VARCHAR(45),
	estado CHAR(2),
	fkUsuario INT,
	fkPrefeitura INT,
	FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
	FOREIGN KEY (fkPrefeitura) REFERENCES prefeitura(idPrefeitura)
);

CREATE TABLE frota(
	idFrota INT AUTO_INCREMENT PRIMARY KEY,
	totalVeiculos INT,
	tipos VARCHAR(45),
	qtdTipo1 INT,
	qtdTipo2 INT,
	qtdTipo3 INT,
	fkPrefeitura INT,
	FOREIGN KEY (fkPrefeitura) REFERENCES prefeitura(idPrefeitura)
);

CREATE TABLE logs(
	idLog INT AUTO_INCREMENT PRIMARY KEY,
	horaInicioProcesso DATETIME,
	horaEncerramentoProcesso DATETIME,
	qtdErros INT
);
