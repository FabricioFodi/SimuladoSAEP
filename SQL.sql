-- Salvando aqui por que no MySQL some o arquivo.

CREATE DATABASE provasaep;
USE provasaep;

CREATE TABLE usuario (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(60) DEFAULT NULL,
  senha VARCHAR(50) DEFAULT NULL
);

CREATE TABLE professor (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) DEFAULT NULL,
  usuario_id INT DEFAULT NULL,
  KEY usuario_id (usuario_id),
  CONSTRAINT professor_fk FOREIGN KEY (usuario_id) REFERENCES usuario (id)
);

CREATE TABLE turmas (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) DEFAULT NULL,
  professor_id INT DEFAULT NULL,
  KEY professor_id (professor_id),
  CONSTRAINT turmas_fk FOREIGN KEY (professor_id) REFERENCES professor (id)
);

CREATE TABLE atividades (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  descricao VARCHAR(255) DEFAULT NULL,
  turma_id INT DEFAULT NULL,
  KEY turma_id (turma_id),
  CONSTRAINT atividades_fk FOREIGN KEY (turma_id) REFERENCES turmas (id)
);

-- Inserindo registros na tabela usuario
INSERT INTO usuario (id, email, senha) 
VALUES 
(1,'fabricio@gmail.com','123456'),
(2,'maria@gmail.com','senha123');

-- Inserindo registros na tabela professor com o campo usuario_id associado
INSERT INTO professor (id, nome, usuario_id) 
VALUES 
(1,'Professor Fabricio', 1),
(2,'Professora Maria', 2);

-- Inserindo registros na tabela turmas com o campo professor_id associado
INSERT INTO turmas (id, nome, professor_id)
VALUES
(1,'Turma de Matemática',1),
(2,'Turma de Português',2),
(3,'Turma SAEP',1),
(4,'Desenvolvimento de Sistemas',2),
(5,'Testes de Sistemas',2),
(6,'Banco de Dados',1);

-- Inserindo registros na tabela atividades com o campo turma_id associado
INSERT INTO atividades (id, descricao, turma_id)
VALUES
(1,'Atividade 1 - Geometria Espacial',1),
(2,'Atividade 2 - Geometria Analítica',1),
(3,'Atividade 1 - Pretérito Perfeito',2),
(4,'Atividade 2 - Pretérito Mais-Que-Perfeito',2);

select nome from turmas;
select * from usuario;
select * from professor;
select * from turmas where professor_id = 2;  -- Supondo que 1 seja o id do professor
SELECT id, nome FROM turmas WHERE professor_id = 2;
SELECT id, descricao FROM atividades WHERE professor_id = 1 AND turma_id = 3; -- turmas do professor_id = 1 (1, 3, 6)
SELECT * FROM turmas WHERE professor_id = 1;
