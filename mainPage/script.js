const nomeProf = document.getElementById('nomeProfessor');
const turmasBody = document.getElementById('turmas-body');
const professor_id = localStorage.getItem('professor_id');
const btnCadastrar = document.getElementsByClassName('cadastrar')[0];
const trNome = document.getElementById('nomeTurma');
const trAcao = document.getElementById('acoes');
const div = document.getElementById('TurmaSelecionada');

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
            turmasBody.innerHTML = '';  // Limpar a tabela
            div.textContent = '';  // Limpar o nome da turma
            trNome.textContent = 'Nome da Turma';
            trAcao.textContent = 'Ações';

            if (data.turmas && Array.isArray(data.turmas) && data.turmas.length > 0) {
                data.turmas.forEach((turma, index) => {
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

                    // Adicionar o event listener para excluir e visualizar
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

// Chamar para carregar as turmas na inicialização
carregarTurmas();

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
    fetch(`http://localhost:3000/turmas/${professor_id}/${turmaId}`)
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
            div.textContent = `Turma: ${data.turma.nome}`;
            trNome.textContent = 'Nome da Atividade';
            trAcao.textContent = '';

            if (data.atividades && Array.isArray(data.atividades) && data.atividades.length > 0) {
                data.atividades.forEach((atividade, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${atividade.nome}</td>
                        <td>${atividade.data}</td>
                    `;
                    turmasBody.appendChild(row);
                });
            } else {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="2">Nenhuma atividade encontrada para essa turma.</td>';
                turmasBody.appendChild(row);
            }

            // Adicionar botão "Cadastrar Atividade" e "Voltar"
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="3">
                    <button id="botaoVoltar">Voltar</button>
                </td>
            `;
            turmasBody.appendChild(row);

            // Event listener para o botão "Cadastrar Atividade"
            btnCadastrar.addEventListener('click', () => cadastrarAtividade(turmaId));

            // Event listener para o botão "Voltar"
            document.getElementById('botaoVoltar').addEventListener('click', carregarTurmas);
        })
        .catch(error => {
            console.error('Erro ao carregar atividades:', error);
            turmasBody.innerHTML = '<tr><td colspan="3">Erro ao carregar atividades.</td></tr>';
        });
}

// Função para cadastrar uma nova atividade (exemplo simples)
function cadastrarAtividade(turmaId) {
    const nomeAtividade = prompt('Digite o nome da nova atividade:');
    if (nomeAtividade) {
        fetch(`http://localhost:3000/turmas/${professor_id}/${turmaId}/atividades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: nomeAtividade})
        }).then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar atividade');
            }
            return response.json();
        })
        .then(data => {
            console.log('Atividade cadastrada', data);
            visualizarTurma(turmaId);  // Recarregar a lista de atividades da turma
        })
        .catch(error => {
            console.error('Erro ao cadastrar atividade:', error);
        });
    }
}