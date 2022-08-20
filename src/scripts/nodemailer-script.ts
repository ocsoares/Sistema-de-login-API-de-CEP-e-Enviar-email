import { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer'

export const sendNodemailer = () => (req: Request, res: Response, next: NextFunction) => {
    const reqBody = req.body as any
    
    const { username, email } = reqBody

    const newTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // True para 465 e False para TODO O RESTO de Portas !! <<
        auth: {
            user: 'wqszp12@gmail.com', // Email que vai ENVIAR um email !! <<
            pass: process.env.NODEMAILER_PASS // NESSE CASO, com Gmail, precisa CRIAR uma Senha PRÓPRIA para Programas de Terceiros !! <<
        },
        tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } as any : false
    });

    newTransport.sendMail({
        from: 'Aleatorio <wqszp12@gmail.com>', // Nome do Email (ACHO QUE É OPCIONAL) + <Email> (Se NÃO tiver o Nome do Email, pode colocar o Email DIRETO sem os <> ) !! <<
        to: email, // Se quiser, pode ser uma LISTA de Emails !! <<
        subject: 'Cadastro concluído com sucesso !', // Assunto do Email
        text: `Olá ${username}, seu cadastro foi realizado com sucesso, seja bem vindo(a) !` // Texto do Email (Também pode usar uma Propriedade chamada html !!) !! <<
    })
        .then(response => console.log({
            message: 'Email enviado com sucesso !',
            from: response.envelope.from,
            to: response.envelope.to
        }))
        .catch(console.log);

    next();
}