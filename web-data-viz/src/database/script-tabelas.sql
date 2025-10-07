CREATE DATABASE moveacess;
USE moveacess;

CREATE TABLE usuario (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(45),
	email VARCHAR(100),
	senha VARCHAR(32),
	telefone CHAR(11),
	cpf CHAR(11),
	nivel_acesso INT,
	pcd BOOLEAN,
	descricaoDeficiencia VARCHAR(100)
);

SELECT * FROM Usuario;

SHOW DATABASES;