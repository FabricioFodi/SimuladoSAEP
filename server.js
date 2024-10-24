const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para analisar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos das pastas 'loginPage' e 'mainPage'
app.use(express.static(path.join(__dirname, 'loginPage')));
app.use(express.static(path.join(__dirname, 'mainPage')));

// Rota personalizada para servir o index.html da loginPage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'loginPage', 'index.html'));
});

// Rota para servir o index.html da mainPage
app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainPage', 'index.html'));
});


// Configuração de conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'provasaep'
});

connection.connect((erro) => {
    if (!erro) {
        console.log('Conectado ao banco de dados!');
        return;
    }
    console.log('Erro ao conectar ao banco de dados: ', erro);
});

// Rota para autenticação
app.post('/autenticar', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuario WHERE email = ? AND senha = ?'; //passei duas horas pra perceber que o erro era aqui pq eu coloquei usuarios e não usuario :)))))))))))))))))))
    connection.query(query, [email, senha], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro });
        }
        if (resultados.length > 0) {
            const professsor = resultados[0];
            return res.json({ sucesso: true, professor_id: professsor.id });
        } else {
            return res.json({ sucesso: false });
        }
    });
});


// Rota para buscar dados do professor
app.get('/professor/:professor_id', (req, res) => {
    const professorId = req.params.professor_id;
    const query = 'SELECT nome FROM professor WHERE id = ?';

    connection.query(query, [professorId], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (resultados.length > 0) {
            return res.json({ nome: resultados[0].nome });
        } else {
            return res.status(404).json({ erro: 'Professor não encontrado no banco de dados' });
        }
    });
});


app.get('/turmas/:professor_id', (req, res) => {
    const professor_id = req.params.professor_id;
    console.log(professor_id);
    const query = 'SELECT id, nome FROM turmas WHERE professor_id = ?'; // Usando ? para prevenir SQL Injection

    connection.query(query, [professor_id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (resultados.length > 0) {
            const nomeTurmas = resultados.map(turma => ({
                id: turma.id,
                nome: turma.nome
            }));
            return res.json({ turmas: nomeTurmas });
        } else {
            return res.status(404).json({ erro: 'Nenhuma turma encontrada para o professor' });

        }
    });
});

app.delete('/turmas/:professor_id/:turma_id', (req, res) => {
    const { professor_id, turma_id } = req.params;
    const query = 'DELETE FROM turmas WHERE professor_id = ? AND id = ?';

    connection.query(query, [professor_id, turma_id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (resultados.affectedRows > 0) {
            return res.json({ message: 'Turma deletada com sucesso!' });
        } else {
            return res.status(404).json({ erro: 'Turma não encontrada para deletar' });
        }
    });
});


//Coleta as informações das atividades da turma
app.get('/turmas/:professor_id/:turma_id/atividades', (req, res) => {
    const { professor_id, turma_id } = req.params;
    const query = 'SELECT id, descricao FROM atividades WHERE professor_id = ? AND turma_id = ?';

    connection.query(query, [professor_id, turma_id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }
        if (resultados.length > 0) {
            return res.json({ atividades: resultados });
        } else {
            return res.status(200).json({ atividades: [], mensagem: 'Não há atividades cadastradas para essa turma' });
        }
    })
});

//Posta as atividades da turma
app.post('/turmas/:professor_id/:turma_id/atividades', (req, res) => {
    const { professor_id, turma_id } = req.params;
    const { descricao } = req.body;
    console.log('professor_id:', professor_id, 'turma_id:', turma_id, 'descricao:', descricao);

    const query = 'INSERT INTO atividades (descricao, professor_id, turma_id) VALUES (?, ?, ?)';

    connection.query(query, [descricao, professor_id, turma_id], (erro, resultados) => {
        if (erro) {
            console.error('Erro no banco de dados:', erro); // Para ver detalhes do erro
            return res.status(500).json({ erro: erro.message });
        }
        return res.status(201).json({ id: resultados.insertId, descricao, professor_id, turma_id });
    });
});

//Cria uma nova turma
app.post('/turmas/:professor_id', (req, res) => {
    const { professor_id } = req.params;
    const { nome } = req.body;

    const query = 'INSERT INTO turmas (nome, professor_id) VALUES (?, ?)';

    connection.query(query, [nome, professor_id], (erro, resultados) => {
        if(erro) {
            console.error('Erro no banco de dados: ', erro);
            return res.status(500).json({ erro: erro.message });
        } else {
            return res.status(201).json({ id: resultados.insertId, nome, professor_id});
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`); // fabricio@gmail.com - 123456 // maria@gmail.com - senha123
});
