"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNodemailer = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var sendNodemailer = function () { return function (req, res, next) {
    var reqBody = req.body;
    var username = reqBody.username, email = reqBody.email;
    var newTransport = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wqszp12@gmail.com',
            pass: process.env.NODEMAILER_PASS
        }
    });
    newTransport.sendMail({
        from: 'Aleatorio <wqszp12@gmail.com>',
        to: email,
        subject: 'Cadastro concluído com sucesso !',
        text: "Ol\u00E1 ".concat(username, ", seu cadastro foi realizado com sucesso, seja bem vindo(a) !")
    })
        .then(function (response) { return console.log({
        message: 'Email enviado com sucesso !',
        from: response.envelope.from,
        to: response.envelope.to
    }); })
        .catch(console.log);
    next();
}; };
exports.sendNodemailer = sendNodemailer;
