import axios from "axios";

// IMPORTANTE: Coloquei o <script> no FINAL do Arquivo .html porque no Topo NÃO estava Lendo !! << 
//  OBS: OU usar no Topo e colocar defer no final do script, porque ai Espera Carregar o HTML Primeiro << !!

const getUsername = document.getElementById('username') as HTMLInputElement;
const getEmail = document.getElementById('email') as HTMLInputElement;
const getCPF = document.getElementById('cpf') as HTMLInputElement;
const getCEP = document.getElementById('cep') as HTMLInputElement;
const getPassword = document.getElementById('password') as HTMLInputElement;
const getConfirmationPassword = document.getElementById('password-confirmation') as HTMLInputElement;
const getForm = document.getElementById('form') as HTMLInputElement;

const setSuccessHTML = (input: any, message?: string) => {
    const formInput = input.parentElement // Pega a Classe PAI (HTML) do Input Especificado !! <<

        // Adicionando a Classe de Success !! << 
    formInput.className = 'form-input success'
}

const setErrorHTML = (input: any, message: string) => {
    const formInput = input.parentElement
    const getSmall = formInput.querySelector('small') // Usei querySelector aqui porque o small NÃO TEM ID e porque eu quis Selecionar TODOS os small Dentro da Classe Pai !! <<

    // Adicionando a Mensagem de Erro !! <<
    getSmall.innerText = message

    formInput.className = 'form-input error'
}

const backspaceGetUsername = () => getUsername.addEventListener('keyup', anykey => {
    let usernameLenght = getUsername.value.length

    if (usernameLenght >= 0 && usernameLenght <= 7 && anykey.key === 'Backspace') {
        setErrorHTML(getUsername, 'Usuário inválido !');
    }
})
    
const validateEmail = (mail: any) => {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

const backspaceEmail = () => getEmail.addEventListener('keyup', anykey => {
    let emailLenght = getEmail.value.length

    if(anykey.key === 'Backspace' && !validateEmail(getEmail)){
        setErrorHTML(getEmail, 'Email inválido !');
        emailLenght -= 1;        
    }
})

const backspaceCEP = () => getCEP.addEventListener('keyup', anykey => {
    let CEPLenght = getCEP.value.length;

    if(anykey.key === 'Backspace'){
        setErrorHTML(getCEP, 'CEP inválido !');
        CEPLenght -= 1;
    }
})

const backspacePassword = () => getPassword.addEventListener('keyup', anykey => {
    let passwordLenght = getPassword.value.length

    if(anykey.key === 'Backspace' && passwordLenght < 7){
        setErrorHTML(getPassword, 'Senha inválida !');
        passwordLenght -= 1;
    }
})

const blockEnterConfirmPassword = () => getConfirmationPassword.addEventListener('keypress', anykey => {

    let lenghtConfirmPassword = getConfirmationPassword.value.length

    let valueConfirmPassword = getConfirmationPassword.value
    let valuePassword = getPassword.value

    if(anykey.key === 'Enter' && lenghtConfirmPassword < 7){
        anykey.preventDefault();
    }

    if(anykey.key === 'Enter' && valueConfirmPassword !== valuePassword){
        anykey.preventDefault();
    }
})

const backspaceGetCPF = () => getCPF.addEventListener('keyup', anykey => {
    const keyValue = anykey.key
    let lengthCPF = getCPF.value.length;

    if(lengthCPF >= 0 && keyValue === 'Backspace'){
        setErrorHTML(getCPF, 'CPF inválido !');
    }
})

const checkInputs = () => {

    backspaceGetUsername();
    
    getUsername.addEventListener('keypress', anykey => {
        // O const usernameValue.lenght NÃO FUNCIONA porque ele é const, ÓBVIO !!!! <<

        const keyValue = anykey.key;

        const usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i // Esse Regex só Permite Letras de a-z A-Z, Espaço e Acentuação nos Caracteres (ó, ã, ...) !! <<

        let usernameLenght = getUsername.value.length;

        if(keyValue === 'Enter'){ // Retira o Espaço Automático do 'Enter' !! <<
            usernameLenght -= 1;
            if(usernameLenght <= 5){ // Se o Lenght for MENOR que Determinada Condição, BLOQUEIA o ENTER !! <<
                anykey.preventDefault();
            }
        }

        if(!keyValue.toString().match(usernameRegex)){
            anykey.preventDefault();
            usernameLenght -= 1;
        }
        if(usernameLenght <= 5){
            setErrorHTML(getUsername, 'Usuário inválido !');
        }
        else{
            setSuccessHTML(getUsername);
        }

    })

        // NÃO ficou Totalmente Validado !! <<
    getEmail.addEventListener('keypress', anykey => {

        backspaceEmail();

        let emailLenght = getEmail.value.length

        const keyValue = anykey.key
        
        if(keyValue === 'Enter'){
            emailLenght -= 1;
            if(!validateEmail(getEmail.value)){
                anykey.preventDefault();
            }
        }

        if(keyValue === ' '){
            anykey.preventDefault();
            emailLenght -= 1;
        }
        
        if(!validateEmail(getEmail.value)){
            setErrorHTML(getEmail, 'Email inválido !');
        }
        else{
            setSuccessHTML(getEmail);
        }
    })

    getCPF.addEventListener('keypress', anykey => {
    
        let lengthCPF = getCPF.value.length + 1
    
        const keyValue = anykey.key as string | number;
    
        const patternLetters = /[0-9]/;
    
        if(keyValue === 'Enter'){}
    
        if(keyValue === 'Enter'){
            lengthCPF -= 1;
        }
        
        else if(!keyValue.toString().match(patternLetters)){
            anykey.preventDefault();
            lengthCPF -= 1;
        }
        
        backspaceGetCPF();
    
        if(lengthCPF === 4 || lengthCPF === 8){
             getCPF.value += '.'
            }
    
        else if(lengthCPF === 12){
            getCPF.value += '-'
        }
    
        else if(lengthCPF === 14 || lengthCPF === 15){
            setSuccessHTML(getCPF);
        }
    
        else{
            setErrorHTML(getCPF, 'CPF inválido !');
        }
    })

    getCEP.addEventListener('keypress', anykey => {

        backspaceCEP();

        let CEPLenght = getCEP.value.length

        const keyValue = anykey.key;

        const patterNumbers = /[0-9]/; // APENAS Números !! <<
        
        if(keyValue === 'Enter'){} // Fiz isso para Liberar o Enter para PULAR LINHA, porque pelo o que eu entendi ele está entre as Letras, e não permiti Aqui !! <<

        if(keyValue === 'Enter'){ // Tira o Espaço Automático do Enter LIBERADO !! << 
            CEPLenght -= 1;
        }

        else if(!keyValue.match(patterNumbers)){ // Se NÃO for Números, ELE IMPEDE de Digitar no Input !! (else if para Permitir o Enter ACIMA !!!) <<
            anykey.preventDefault();
            CEPLenght -= 1;                     // Pelo o que eu percebi, o preventDefault() nesse caso, deixa o Char Inválido Passar UMA VEZ, então Aumenta a lenght do 
                                                // CPF +1 UMA VEZ, então com esse -1 ele também DIMINUI UMA VEZ !! <<  
        }

        if(CEPLenght === 5) {
            getCEP.value += '-'
        }

        if(CEPLenght < 8 ){
            if(anykey.key === 'Enter'){
                anykey.preventDefault();
            }
            setErrorHTML(getCEP, 'CEP inválido !');
        }
    })

    getPassword.addEventListener('keypress', anykey => {

        backspacePassword();

        let passwordLenght = getPassword.value.length;

        if(passwordLenght < 6){
            setErrorHTML(getPassword, 'Senha inválida !');
        }
        else{
            setSuccessHTML(getPassword);
        }
    })

        // Tentar acessar o lenght do Password normal NESSA ConfirmationPassword !! <<<
    getConfirmationPassword.addEventListener('keyup', anykey => { // Por algum motivo, o keypress NÃO funcinou, sempre Tirava UM CHARACTER, o keyup DEU CERTO !! <<

            blockEnterConfirmPassword();

            let finalPassword = getPassword.value
            let finalConfirmPassword = getConfirmationPassword.value

            if(finalConfirmPassword.length < 7){
                setErrorHTML(getConfirmationPassword, 'Senha inválida !');
            }

            else if(finalConfirmPassword === finalPassword){
                setSuccessHTML(getConfirmationPassword);
            }
            
            else{
                setErrorHTML(getConfirmationPassword,'As senhas não coincidem !');
            }
    })    
}

    //  Fiz isso porque o keypress a PRIMEIRA POSIÇÃO DO .value É null, e isso dava erro na API de CEP !! <<  
getCEP.addEventListener('keyup', anykey => {
    let CEPLenght = getCEP.value.length;
    
    if(CEPLenght === 9){ 
        const getCEPValue = getCEP.value

        const url = `https://viacep.com.br/ws/${getCEPValue}/json`;

            axios.get(url)
                .then(res => {
                    const { ...getAllData } = res.data
    
                    const checkErrorAPI = getAllData.hasOwnProperty('erro');
                    if(checkErrorAPI){
                        getCEP.addEventListener('keypress', anykey => {
                            if(anykey.key === 'Enter'){
                                anykey.preventDefault();
                            }
                        })
                        return setErrorHTML(getCEP, 'Esse CEP não existe !');
                    }
    
                    else{
                        setSuccessHTML(getCEP);
                    }
                })
                .catch(error => console.log(`Erro na aplicaçãooo: ${error}`));
        }
})

    checkInputs();

    // Função para DESABILITAR o CONTROL + V (Colar = paste) e Movimentar o Valor de um Input para OUTRO Input (drop) !! << 
const disablePasteAndDrop = (HTMLInput: HTMLInputElement) => {
    
        HTMLInput.addEventListener('paste', anykey => {
            anykey.preventDefault();
        })
    
        HTMLInput.addEventListener('drop', anykey => {
            anykey.preventDefault();
        })
}

disablePasteAndDrop(getUsername);
disablePasteAndDrop(getEmail);
disablePasteAndDrop(getCPF);
disablePasteAndDrop(getCEP);
disablePasteAndDrop(getPassword);
disablePasteAndDrop(getConfirmationPassword);

    // Checa de está tudo VERDE, se tiver, LIBERA o ENTER !! <<
    //  OBS: NÃO CONSEGUI Bloquear o Botão, Pesquisar depois ! <
getForm.addEventListener('keypress', anykey => {

    let getAllFormInput: any = getForm.querySelectorAll('.form-input');    

let checkForm = [...getAllFormInput].every((formInput)  => {
    if(formInput.className === 'form-input success'){
        return true;
    }
})  

    if(!checkForm){
        if(anykey.key === 'Enter'){
            anykey.preventDefault();   
        }
    }
})