const loginEmail = document.getElementById('login-email') as HTMLInputElement;
const loginPassword = document.getElementById('login-password') as HTMLInputElement;

const setErrorHTML = (input: any, message: string) => {
    const formInput = input.parentElement
    const getSmall = formInput.querySelector('small') // Usei querySelector aqui porque o small NÃO TEM ID e porque eu quis Selecionar TODOS os small Dentro da Classe Pai !! <<

    // Adicionando a Mensagem de Erro !! <<
    getSmall.innerText = message

    formInput.className = 'form-input error'
}

setErrorHTML(loginEmail, '');
setErrorHTML(loginPassword, 'Usuário ou senha inválido !');