import bodyParser from "body-parser"; // ACHO que NÃO precisa aqui, porque JÁ está sendo Utilizado na Rota !!
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response} from "express";
import { BadRequestError, InternalServerError } from "../models/api-error.model";
import { AccountRepository } from "../repositories/accountRepository";
import { CPFRepository } from "../repositories/CPFRepository";
import path from "path";
import jwt from 'jsonwebtoken'
import { sendNodemailer } from "../scripts/nodemailer-script";
import { redisClient } from "../redisConfig";

const __dirname = path.resolve()
// const loggedHTML = path.join(__dirname, '/src/html/loginSuccessufull.html');
const loginErrorHTML = path.join(__dirname, '/src/html/loginError.html');
const logoutHTML = path.join(__dirname, '/src/html/logout.html');
const registerHTML = path.join(__dirname, '/src/html/register.html'); 

// >>> IMPORTANTÍSSIMO: Por algum motivo, tem DOIS Request e Response, um são do Express e o outro ACHO que é do bodyParser (NA ROTA), então NÃO ESTAVA pe-
// -gando as Configurações do meu express.d.ts Porque Estava com o Request/Response SEM SER O DO Express !! <<<<

// Procurar sobre aquele flash (mensagem) para Validar se o CEP existe USANDO a API !! <<<<<<<<<<<<<<
export class HTMLAccountController {
    async createAccountHTML(req: Request, res: Response, next: NextFunction){
        const reqBody = req.body as any

        const { username, email, cpf, cep, password, passwordConfirmation } = reqBody // O NOME dessas Variáveis são definidas em name="..." no HTML !! <<< 

        if(!username || !email || !cpf || !cep || !password){
            console.log('Dados inválidos !');
            return res.sendFile(registerHTML);
        }


        if(typeof(username) !== 'string' || typeof(email) !== 'string' || typeof(cpf) !== 'string' || typeof(cep) !== 'string' || typeof(password) !== 'string'){
            console.log('Dados inválidos !');
            return res.sendFile(registerHTML);
        }
        

        const usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i
        if(!username.match(usernameRegex)){
            console.log('Usuário inválido !');
            return res.sendFile(registerHTML);
        }

        const validateEmail = (mail: any) => {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
        }
        if(!validateEmail(email)){
            console.log('Email inválido !');
            return res.sendFile(registerHTML);
        }

        const CPFRegex = /[0-9]/;
        if(!cpf.match(CPFRegex)){
            console.log('CPF inválido !');
            return res.sendFile(registerHTML);
        }

        const CEPRegex = /[0-9]/; // APENAS Números !! <<
        if(!cep.match(CEPRegex)){
            console.log('CEP inválido !');
            return res.sendFile(registerHTML);
        }

        if(passwordConfirmation !== password){
            console.log('As senhas não coincidem !');
            return res.sendFile(registerHTML);
        }

        const searchUsername = await AccountRepository.findOneBy({username});
        if(searchUsername){
            console.log('Usuário existente !');
            return res.sendFile(registerHTML);
        }

        const searchUserByEmail = await AccountRepository.findOneBy({email});
        if(searchUserByEmail){
            console.log('Email existente !');
            return res.sendFile(registerHTML);
        }

        const searchCEP = await AccountRepository.findOneBy({cep});
        if(searchCEP){
            console.log('CEP existente !');
            return res.sendFile(registerHTML);
        }

        // ACHO que pode ter a MESMA SENHA no Banco de Dados, então NÃO verifiquei !! <<

        const searchCPF = await CPFRepository.findOneBy({cpf});
        if(searchCPF){
            console.log('CPF existente !');
            return res.sendFile(registerHTML);
        }

        const encryptPassword = await bcrypt.hash(password, 10);

        if(!encryptPassword){
            console.log('Erro na encriptação da senha !');
            return res.sendFile(registerHTML);
        }

        const saveAccountHTML = AccountRepository.create({
            username,
            email,
            cep,
            password: encryptPassword
        })

        const saveNameAndCPFHTML = CPFRepository.create({
            name: username,
            cpf
        })

        await AccountRepository.save(saveAccountHTML);

        await CPFRepository.save(saveNameAndCPFHTML);

        sendNodemailer();

        next();
    }

    async loginAccountHTML(req: Request, res: Response, next: NextFunction){
        const reqBody = req.body as any

        const { email, password } = reqBody

        if(!email || !password){
            return res.sendFile(loginErrorHTML);
        }

        const searchUserByEmail = await AccountRepository.findOneBy({email}) // Procura por TODAS as Informações no Banco de Dados para o EMAIL ESPECIFICADO !! <<

        if(!searchUserByEmail){
            return res.sendFile(loginErrorHTML);
        }

        const searchPassword = await bcrypt.compare(password, searchUserByEmail.password as any);

        if(!searchPassword){
            return res.sendFile(loginErrorHTML);
        }
        
        const { password:_, ...finalLogin } = searchUserByEmail;

        req.fullLogin = finalLogin // Por algum motivo só está retornando NESSE Middleware...

        const JWTToCookie = jwt.sign({
            id: searchUserByEmail.id,
            email: searchUserByEmail.email,
            username: searchUserByEmail.username
        }, "" + process.env.JWT_HASH , { // Arrumou um ERRO que estava dando no Heroku !! <<
            expiresIn: '12h'
        })
        
                // Tive que fazer desse jeito porque o Heroku bloqueia os Token !! <<
            res.cookie('session_app', JWTToCookie, {
                httpOnly: true, // true = IMPEDE que o Usuário MODIFIQUE o Cookie MANUALMENTE ( + Seguro !! ) !! <<

            });

            res.redirect('/dashboard');

        next();
    }   // ARRRUMAR OS DE BAIXO COM REQ SESSION LOGIN !! <<

    async checkJWTCookie(req: Request, res: Response, next: NextFunction){

        const JWT = req.headers.cookie?.split(';')[0].split('=')[1];
        const tokenNameBrowser = req.headers.cookie?.split('=')[0];

        const JWTPoints = JWT?.split('.') // NÃO tem 3 Pontos, tem APENAS 2, Mas se split pelo Ponto ( . ), ele então é Dividido em 3 Partes !!
                                          //  OBS: Após isso, óbvio, fica com Lenght 3 !! <<<


        if(JWTPoints?.length !== 3 || tokenNameBrowser !== 'session_app'){
            return res.redirect('/login');
        }

        try{
            const verifyJWT = jwt.verify(JWT as string, "" + process.env.JWT_HASH);

            if(verifyJWT){
                req.login = verifyJWT
                
                const { id } = verifyJWT as any;

                const getBlackListJWT = await redisClient.get(`blackListJWT_${JWT}`);
                
                if(JWT === getBlackListJWT as any){ // Se for igual limpa o Cookie e Redireciona para o Login !! <<
                    console.log('Está na Blacklist !!');
                    res.clearCookie('session_app');
                    return res.redirect('/login');
                }

                else{
                    console.log('NÃO está na Blacklist !!');
                }

                if(!id) throw new InternalServerError('ID inválido !'); // Apenas para confirmar e Evitar Futuros erros...

                const searchUserById = await AccountRepository.findOneBy({id})

                if(!searchUserById) throw new InternalServerError('Usuário inválido !');

                const { password:_, ...infoUserNoPass } = searchUserById as any

                req.userLogged = infoUserNoPass;
                
                next();
            }
        }
        catch(error){
            res.clearCookie('session_app');
            res.redirect('/login');
        }
    }

    async logoutAccountHTML(req: Request, res: Response, next: NextFunction){
            const { id } = req.userLogged
    
            const JWT = req.headers.cookie?.split('=')[1] as any
            
            const redisExpires = 24 * 60 * 60; // 1 day

            await redisClient.set(`blackListJWT_${JWT}`, JWT, 'EX', redisExpires);
            console.log('Cacheado !');
    
            res.clearCookie('session_app'); // Limpando o cookie com o nome PADRÃO que eu Criei acima !! <<

            next();
            
            setInterval(() => { // Coloquei isso aqui porque o res.sendFile é ASSÍNCRONO, e o res.end é SÍNCRONO, então Sempre Executava res.end ANTES do res.sendFile e bugava !! <<<
                res.end() // Impede que qualquer OUTRO dado seja escrito (pelo oq entendi...)
            }, 25)
            
            return res.sendFile(logoutHTML);
    }

    async BlockHTMLPageIfLooged(req: Request, res: Response, next: NextFunction){
        const JWT = req.headers.cookie?.split(';')[0].split('=')[1];

        try{
            const verifyJWT = jwt.verify(JWT as string, "" + process.env.JWT_HASH);

            if(verifyJWT){
                return res.redirect('/dashboard'); // Acho que isso aqui vai dar Erro com o Redis !! << 
            }

            // next(); Nesse caso não é necessário, óbvio...
        }
        catch(error){
            next(); // Vai APENAS Retornar para a Página de Login novamente !! <<
        }
    }
}