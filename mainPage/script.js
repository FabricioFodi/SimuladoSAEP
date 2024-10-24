const nomeProf = document.getElementById('nomeProfessor');
const turmasBody = document.getElementById('turmas-body');
const btnCadastrar = document.getElementsByClassName('cadastrar')[0];
const trNome = document.getElementById('nomeTurma');
const trAcao = document.getElementById('acoes');
const div = document.getElementById('TurmaSelecionada');

const professor_id = localStorage.getItem('professor_id');
let turmasCache = {};

//Coletar o Nome do Professor
fetch(`http://localhost:3000/professor/${professor_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar nome do professor.');
        }
        return response.json();
    }).then(data => {
        nomeProf.textContent = 'Olá, ' + data.nome;
    }).catch(error => {
        console.error(error);
        nomeProf.textContent = 'Erro ao carregar nome do professor.';
    });

// Coletar as turmas do professor
function carregarTurmas() {
    fetch(`http://localhost:3000/turmas/${professor_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar turmas.');
            }
            return response.json();
        }).then(data => {
            btnCadastrar.textContent = 'Cadastrar Turma';
            btnCadastrar.onclick = () => cadastrarTurma();
            turmasBody.innerHTML = '';  // Limpar a tabela
            div.textContent = '';  // Limpar o nome da turma
            trNome.textContent = 'Nome da Turma';
            trAcao.textContent = 'Ações';
            
            if (data.turmas && Array.isArray(data.turmas) && data.turmas.length > 0) {
                data.turmas.forEach((turma, index) => {
                    turmasCache[turma.id] = turma.nome;
                    const row = document.createElement('tr');

                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${turma.nome}</td>
                        <td>
                            <button id="BotaoExcluir" data-turma-id="${turma.id}">Excluir</button>
                            <button id="BotaoVisualizar" data-turma-id="${turma.id}">Visualizar</button>
                        </td>
                    `;

                    turmasBody.appendChild(row);

                    // Adicionar botao para excluir e visualizar
                    row.querySelector('#BotaoExcluir').addEventListener('click', () => {
                        deletarTurma(turma.id);
                    });

                    row.querySelector('#BotaoVisualizar').addEventListener('click', () => {
                        visualizarTurma(turma.id);
                    });
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="3">Nenhuma turma encontrada.</td>';
                turmasBody.appendChild(row);
            }
        }).catch(error => {
            console.error('Erro:', error);
            turmasBody.textContent = 'Erro ao carregar turmas.';
        });
}

// Carregar as turmas na inicialização
carregarTurmas();

// Função para deletar uma turma
function deletarTurma(turmaId) {
    fetch(`http://localhost:3000/turmas/${professor_id}/${turmaId}`, { 
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => {
        if(!response.ok){
            throw new Error('Erro ao deletar turma');
        }
        return response.json();
    })
    .then(data => {
        console.log('turma deletada', data);
        window.location.reload();
    })
    .catch(error => {
        console.error('Erro:', error);
    })
    
}

// Função para visualizar as atividades de uma turma
function visualizarTurma(turmaId) {
    const nomeTurma = turmasCache[turmaId]
    fetch(`http://localhost:3000/turmas/${professor_id}/${turmaId}/atividades`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao visualizar turma');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            btnCadastrar.textContent = 'Cadastrar Atividade';
            // Limpar as turmas e exibir as atividades da turma selecionada
            turmasBody.innerHTML = '';
            div.textContent = `Turma: ${nomeTurma}`;
            trNome.textContent = 'Nome da Atividade';
            trAcao.textContent = '';

            if (data.atividades && data.atividades.length > 0) {
                data.atividades.forEach((atividade, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${atividade.descricao}</td>
                    `;
                    turmasBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="2">' + (data.mensagem || 'Nenhuma atividade encontrada para essa turma.') + '</td>';
                turmasBody.appendChild(row);
            }

            // Adicionar botão "Voltar"
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3">
                    <button id="botaoVoltar">Voltar</button>
                </td>
            `;
            turmasBody.appendChild(row);

            // botão "Cadastrar Atividade"
            btnCadastrar.onclick = () => cadastrarAtividade(turmaId);
            //btnCadastrar.addEventListener('click', cadastrarAtividade(turmaId)); //Assim estava dando erro

            // botão "Voltar"
            document.getElementById('botaoVoltar').addEventListener('click', carregarTurmas);
        })
        .catch(error => {
            console.error('Erro ao carregar atividades:', error);
            turmasBody.innerHTML = '<tr><td colspan="3">Erro ao carregar atividades.</td></tr>';
        });
}

// Função para cadastrar uma nova atividade
function cadastrarAtividade(turmaId) {
    const descricaoAtividade = prompt('Digite a descrição da nova atividade:');
    
    if (descricaoAtividade === null) {
        console.error('Entrada cancelada pelo usuário.');
        return;
    }
    
    const trimmedDescricao = descricaoAtividade.trim();
    console.log(`turmaId: ${turmaId}`);  
    console.log(`URL: http://localhost:3000/turmas/${professor_id}/${turmaId}/atividades`);

    if (trimmedDescricao.length === 0) {
        console.error('Descrição da atividade não pode ser vazia.');
        return;
    }

    fetch(`http://localhost:3000/turmas/${professor_id}/${turmaId}/atividades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao: trimmedDescricao })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar atividade');
        }
        return response.json();
    })
    .then(data => {
        console.log('Atividade cadastrada', data);
        visualizarTurma(turmaId);
    })
    .catch(error => {
        console.error('Erro ao cadastrar atividade:', error);
    });
}

// Botão "Cadastrar Turma"
function cadastrarTurma(){
    const novaTurma = prompt('Digite o nome da nova turma:');
    fetch(`http://localhost:3000/turmas/${professor_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: novaTurma })
    }).then(response => {
        if(!response.ok){
            throw new Error('Erro ao cadastrar turma');
        } 
        return response.json();
    }).then(data => {
        console.log('Turma Cadastrada', data);
        window.location.reload();
    }).catch(error => {
        console.error('erro: ', error);
    });
}