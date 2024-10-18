const nomeProf = document.getElementById('nomeProfessor');
const turmasBody = document.getElementById('turmas-body');
const professor_id = 1;

//Coletar o Nome do Professor
fetch('http://localhost:3000/professor')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar nome do professor.');
        }
        return response.json();
    }).then(data => {
        nomeProf.textContent = 'Olá, ' + data.nome;
    }).catch(error => {
        console.error('Erro:', error);
        nomeProf.textContent = 'Erro ao carregar nome do professor.';
    })

//Coletar as turmas do professor
fetch(`http://localhost:3000/turmas/${professor_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar turmas.');
        }
        return response.json();
    }).then(data => {
        console.log(data);
        turmasBody.innerHTML = '';

        if (data.turmas && Array.isArray(data.turmas) && data.turmas.length > 0) {
            data.turmas.forEach((turma, index) => {
                const row = document.createElement('tr');

                // Aqui, você deve usar turma.id ou outro identificador da turma se disponível
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${turma.nome}</td>
                    <td>
                        <button id="BotaoExcluir" data-turma-id="${turma.id}">Excluir</button>
                        <button id="BotaoVisualizar" data-turma-id="${turma.id}">Visualizar</button>
                    </td>
                `;

                turmasBody.appendChild(row);

                // Adicionando o event listener para excluir e visualizar
                row.querySelector('#BotaoExcluir').addEventListener('click', () => {
                    deletarTurma(turma.id); // Chame a função de deletar
                });

                row.querySelector('#BotaoVisualizar').addEventListener('click', () => {
                    visualizarTurma(turma.id); // Chame a função de visualizar
                });
            });
        } else {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">Nenhuma turma encontrada.</td>';
            turmasBody.appendChild(row);
        }
    }).catch(error => {
        console.error('Erro:', error);
        turmas.textContent = 'Erro ao carregar turmas.';
    });


function deletarTurma(turmaId) {
    fetch(`http://localhost:3000/turmas/${turmaId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'aplication/json',
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