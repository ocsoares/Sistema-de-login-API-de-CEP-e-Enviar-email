"use strict";
var loginEmail = document.getElementById('login-email');
var loginPassword = document.getElementById('login-password');
var setErrorHTML = function (input, message) {
    var formInput = input.parentElement;
    var getSmall = formInput.querySelector('small');
    getSmall.innerText = message;
    formInput.className = 'form-input error';
};
setErrorHTML(loginEmail, '');
setErrorHTML(loginPassword, 'Usuário ou senha inválido !');
