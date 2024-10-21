const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para analisar JSON
app.use(express.json());

// Middleware para servir arquivos estáticos das pastas 'loginPage' e 'mainPage'
app.use(express.static(path.join(__dirname)));

// Configuração de conexão com o banco de dados
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'provaSAEP'
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
            return res.json({ sucesso: true });
        } else {
            return res.json({ sucesso: false });
        }
    });
});


// Rota para buscar dados do professor
app.get('/professor', (req, res) => {
    const query = 'SELECT nome FROM professor WHERE id = 1';
    
    connection.query(query, (erro, resultados) => {
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
    const query = 'SELECT id, nome FROM turmas WHERE professor_id = ?'; // Usando ? para prevenir SQL Injection

    connection.query(query, [professor_id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }

        if (resultados.length > 0) {
            // Corrigindo o mapeamento para retornar um array de objetos
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
        if(erro) {
            return res.status(500).json({erro: erro.message});
        }

        if(resultados.affectedRows > 0) {
            return res.json({message: 'Turma deletada com sucesso!'});
        } else {
            return res.status(404).json({erro: 'Turma não encontrada para deletar'});
        }
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
