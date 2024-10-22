const formInput = document.getElementById('form-input');
const Botao = document.getElementById('login');

Botao.addEventListener('click', (e) => {
    e.preventDefault();

    const email = formInput.elements['email'].value;
    const senha = formInput.elements['senha'].value;

    fetch('http://localhost:3000/autenticar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na autenticação');
        }
        return response.json();
    })
    .then(data => {
        if (data.sucesso) {
            console.log('Login bem-sucedido!');
            localStorage.setItem('professor_id', data.professor_id);
            window.location.href = '/mainPage/index.html'; // Redirecionar para a página principal ou dashboard
        } else {
            alert('Usuário ou senha incorretos.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
