"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var getUsername = document.getElementById('username');
var getEmail = document.getElementById('email');
var getCPF = document.getElementById('cpf');
var getCEP = document.getElementById('cep');
var getPassword = document.getElementById('password');
var getConfirmationPassword = document.getElementById('password-confirmation');
var getForm = document.getElementById('form');
var setSuccessHTML = function (input, message) {
    var formInput = input.parentElement;
    formInput.className = 'form-input success';
};
var setErrorHTML = function (input, message) {
    var formInput = input.parentElement;
    var getSmall = formInput.querySelector('small');
    getSmall.innerText = message;
    formInput.className = 'form-input error';
};
var backspaceGetUsername = function () { return getUsername.addEventListener('keyup', function (anykey) {
    var usernameLenght = getUsername.value.length;
    if (usernameLenght >= 0 && usernameLenght <= 7 && anykey.key === 'Backspace') {
        setErrorHTML(getUsername, 'Usuário inválido !');
    }
}); };
var validateEmail = function (mail) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
};
var backspaceEmail = function () { return getEmail.addEventListener('keyup', function (anykey) {
    var emailLenght = getEmail.value.length;
    if (anykey.key === 'Backspace' && !validateEmail(getEmail)) {
        setErrorHTML(getEmail, 'Email inválido !');
        emailLenght -= 1;
    }
}); };
var backspaceCEP = function () { return getCEP.addEventListener('keyup', function (anykey) {
    var CEPLenght = getCEP.value.length;
    if (anykey.key === 'Backspace') {
        setErrorHTML(getCEP, 'CEP inválido !');
        CEPLenght -= 1;
    }
}); };
var backspacePassword = function () { return getPassword.addEventListener('keyup', function (anykey) {
    var passwordLenght = getPassword.value.length;
    if (anykey.key === 'Backspace' && passwordLenght < 7) {
        setErrorHTML(getPassword, 'Senha inválida !');
        passwordLenght -= 1;
    }
}); };
var blockEnterConfirmPassword = function () { return getConfirmationPassword.addEventListener('keypress', function (anykey) {
    var lenghtConfirmPassword = getConfirmationPassword.value.length;
    var valueConfirmPassword = getConfirmationPassword.value;
    var valuePassword = getPassword.value;
    if (anykey.key === 'Enter' && lenghtConfirmPassword < 7) {
        anykey.preventDefault();
    }
    if (anykey.key === 'Enter' && valueConfirmPassword !== valuePassword) {
        anykey.preventDefault();
    }
}); };
var backspaceGetCPF = function () { return getCPF.addEventListener('keyup', function (anykey) {
    var keyValue = anykey.key;
    var lengthCPF = getCPF.value.length;
    if (lengthCPF >= 0 && keyValue === 'Backspace') {
        setErrorHTML(getCPF, 'CPF inválido !');
    }
}); };
var checkInputs = function () {
    backspaceGetUsername();
    getUsername.addEventListener('keypress', function (anykey) {
        var keyValue = anykey.key;
        var usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i;
        var usernameLenght = getUsername.value.length;
        if (keyValue === 'Enter') {
            usernameLenght -= 1;
            if (usernameLenght <= 5) {
                anykey.preventDefault();
            }
        }
        if (!keyValue.toString().match(usernameRegex)) {
            anykey.preventDefault();
            usernameLenght -= 1;
        }
        if (usernameLenght <= 5) {
            setErrorHTML(getUsername, 'Usuário inválido !');
        }
        else {
            setSuccessHTML(getUsername);
        }
    });
    getEmail.addEventListener('keypress', function (anykey) {
        backspaceEmail();
        var emailLenght = getEmail.value.length;
        var keyValue = anykey.key;
        if (keyValue === 'Enter') {
            emailLenght -= 1;
            if (!validateEmail(getEmail.value)) {
                anykey.preventDefault();
            }
        }
        if (keyValue === ' ') {
            anykey.preventDefault();
            emailLenght -= 1;
        }
        if (!validateEmail(getEmail.value)) {
            setErrorHTML(getEmail, 'Email inválido !');
        }
        else {
            setSuccessHTML(getEmail);
        }
    });
    getCPF.addEventListener('keypress', function (anykey) {
        var lengthCPF = getCPF.value.length + 1;
        var keyValue = anykey.key;
        var patternLetters = /[0-9]/;
        if (keyValue === 'Enter') { }
        if (keyValue === 'Enter') {
            lengthCPF -= 1;
        }
        else if (!keyValue.toString().match(patternLetters)) {
            anykey.preventDefault();
            lengthCPF -= 1;
        }
        backspaceGetCPF();
        if (lengthCPF === 4 || lengthCPF === 8) {
            getCPF.value += '.';
        }
        else if (lengthCPF === 12) {
            getCPF.value += '-';
        }
        else if (lengthCPF === 14 || lengthCPF === 15) {
            setSuccessHTML(getCPF);
        }
        else {
            setErrorHTML(getCPF, 'CPF inválido !');
        }
    });
    getCEP.addEventListener('keypress', function (anykey) {
        backspaceCEP();
        var CEPLenght = getCEP.value.length;
        var keyValue = anykey.key;
        var patterNumbers = /[0-9]/;
        if (keyValue === 'Enter') { }
        if (keyValue === 'Enter') {
            CEPLenght -= 1;
        }
        else if (!keyValue.match(patterNumbers)) {
            anykey.preventDefault();
            CEPLenght -= 1;
        }
        if (CEPLenght === 5) {
            getCEP.value += '-';
        }
        if (CEPLenght < 8) {
            if (anykey.key === 'Enter') {
                anykey.preventDefault();
            }
            setErrorHTML(getCEP, 'CEP inválido !');
        }
    });
    getPassword.addEventListener('keypress', function (anykey) {
        backspacePassword();
        var passwordLenght = getPassword.value.length;
        if (passwordLenght < 6) {
            setErrorHTML(getPassword, 'Senha inválida !');
        }
        else {
            setSuccessHTML(getPassword);
        }
    });
    getConfirmationPassword.addEventListener('keyup', function (anykey) {
        blockEnterConfirmPassword();
        var finalPassword = getPassword.value;
        var finalConfirmPassword = getConfirmationPassword.value;
        if (finalConfirmPassword.length < 7) {
            setErrorHTML(getConfirmationPassword, 'Senha inválida !');
        }
        else if (finalConfirmPassword === finalPassword) {
            setSuccessHTML(getConfirmationPassword);
        }
        else {
            setErrorHTML(getConfirmationPassword, 'As senhas não coincidem !');
        }
    });
};
getCEP.addEventListener('keyup', function (anykey) {
    var CEPLenght = getCEP.value.length;
    if (CEPLenght === 9) {
        var getCEPValue = getCEP.value;
        var url = "https://viacep.com.br/ws/".concat(getCEPValue, "/json");
        axios_1.default.get(url)
            .then(function (res) {
            var getAllData = __rest(res.data, []);
            var checkErrorAPI = getAllData.hasOwnProperty('erro');
            if (checkErrorAPI) {
                getCEP.addEventListener('keypress', function (anykey) {
                    if (anykey.key === 'Enter') {
                        anykey.preventDefault();
                    }
                });
                return setErrorHTML(getCEP, 'Esse CEP não existe !');
            }
            else {
                setSuccessHTML(getCEP);
            }
        })
            .catch(function (error) { return console.log("Erro na aplica\u00E7\u00E3ooo: ".concat(error)); });
    }
});
checkInputs();
var disablePasteAndDrop = function (HTMLInput) {
    HTMLInput.addEventListener('paste', function (anykey) {
        anykey.preventDefault();
    });
    HTMLInput.addEventListener('drop', function (anykey) {
        anykey.preventDefault();
    });
};
disablePasteAndDrop(getUsername);
disablePasteAndDrop(getEmail);
disablePasteAndDrop(getCPF);
disablePasteAndDrop(getCEP);
disablePasteAndDrop(getPassword);
disablePasteAndDrop(getConfirmationPassword);
getForm.addEventListener('keypress', function (anykey) {
    var getAllFormInput = getForm.querySelectorAll('.form-input');
    var checkForm = __spreadArray([], getAllFormInput, true).every(function (formInput) {
        if (formInput.className === 'form-input success') {
            return true;
        }
    });
    if (!checkForm) {
        if (anykey.key === 'Enter') {
            anykey.preventDefault();
        }
    }
});
