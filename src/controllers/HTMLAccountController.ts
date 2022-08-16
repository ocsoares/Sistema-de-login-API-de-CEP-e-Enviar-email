import bodyParser from "body-parser"; // ACHO que NÃO precisa aqui, porque JÁ está sendo Utilizado na Rota !!
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response} from "express";
import { BadRequestError, InternalServerError } from "../models/api-error.model";
import { AccountRepository } from "../repositories/accountRepository";
import { CPFRepository } from "../repositories/CPFRepository";
import path from "path";
import jwt from 'jsonwebtoken'
import { sendNodemailer } from "../scripts/nodemailer-script";

const __dirname = path.resolve()
// const loggedHTML = path.join(__dirname, '/src/html/loginSuccessufull.html');
const loginErrorHTML = path.join(__dirname, '/src/html/loginError.html');

// >>> IMPORTANTÍSSIMO: Por algum motivo, tem DOIS Request e Response, um são do Express e o outro ACHO que é do bodyParser (NA ROTA), então NÃO ESTAVA pe-
// -gando as Configurações do meu express.d.ts Porque Estava com o Request/Response SEM SER O DO Express !! <<<<

// Procurar sobre aquele flash (mensagem) para Validar se o CEP existe USANDO a API !! <<<<<<<<<<<<<<
export class HTMLAccountController {
    async createAccountHTML(req: Request, res: Response, next: NextFunction){
        const reqBody = req.body as any

        const { username, email, cpf, cep, password, passwordConfirmation } = reqBody // O NOME dessas Variáveis são definidas em name="..." no HTML !! <<< 

        if(!username || !email || !cpf || !cep || !password) throw new BadRequestError('Dados inválidos !');
        if(typeof(username) !== 'string' || typeof(email) !== 'string' || typeof(cpf) !== 'string' || typeof(cep) !== 'string' || typeof(password) !== 'string') throw new BadRequestError('Dados inválidos !');

        const usernameRegex = /[a-zA-Z\u00C0-\u00FF ]+/i
        if(!username.match(usernameRegex)) throw new BadRequestError ('Usuário inválido !');

        const validateEmail = (mail: any) => {
            return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
        }
        if(!validateEmail(email)) throw new BadRequestError('Email inválido !');

        const CPFRegex = /[0-9]/;
        if(!cpf.match(CPFRegex)) throw new BadRequestError('CPF inválido !');

        const CEPRegex = /[0-9]/; // APENAS Números !! <<
        if(!cep.match(CEPRegex)) throw new BadRequestError('CEP inválido !');

        if(passwordConfirmation !== password) throw new BadRequestError('As senhas não coincidem !');

        const searchUsername = await AccountRepository.findOneBy({username});
        if(searchUsername) throw new BadRequestError('Usuário existente !');

        const searchEmail = await AccountRepository.findOneBy({email});
        if(searchEmail) throw new BadRequestError('Email existente !');

        const searchCEP = await AccountRepository.findOneBy({cep});
        if(searchCEP) throw new BadRequestError('CEP existente !');

        // ACHO que pode ter a MESMA SENHA no Banco de Dados, então NÃO verifiquei !! <<

        const searchCPF = await CPFRepository.findOneBy({cpf});
        if(searchCPF) throw new BadRequestError('CPF existente !');

        const encryptPassword = await bcrypt.hash(password, 10);

        if(!encryptPassword) throw new InternalServerError();

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

        const searchEmail = await AccountRepository.findOneBy({email}) // Procura por TODAS as Informações no Banco de Dados para o EMAIL ESPECIFICADO !! <<

        if(!searchEmail){
            return res.sendFile(loginErrorHTML);
        }

        const searchPassword = await bcrypt.compare(password, searchEmail.password as any);

        if(!searchPassword){
            return res.sendFile(loginErrorHTML);
        }
        
        const { password:_, ...finalLogin } = searchEmail;

        if(req.session){
            req.session.login = finalLogin
        }

        res.redirect('/dashboard');

        next();
    }

        // Para validar o JWT no Site (jwt.io) precisa PRIMEIRO colocar Secret Key e DEPOIS o JWT para ver se está Realmente VERIFICADO !! <<
    async generateJWT(req: Request, res: Response, next: NextFunction){
        if(req.session?.login){
            
            const JWT = jwt.sign({
                id: req.session.login.id,
                username: req.session.login.username,
                email: req.session.login.email
            }, process.env.JWT_HASH ?? '', {
                expiresIn: '12h'
            })

            req.jwt = JWT;

            res.json({message: `Seu token é: ${req.jwt}`});
        }

        else{
            res.redirect('/login');
        }

        next();
    }

    async verifyJWT(req: Request, res: Response, next: NextFunction){
        if(req.session?.login){
            const { JWTObject } = req.params

            const JWT = JWTObject.split(' ')[0]
            interface JwtPayload{
                id: any
                username: string
                email: string
                iat: number
                exp: number
            }

            try{
                const verifyJWT = jwt.verify(JWT, process.env.JWT_HASH ?? '') as JwtPayload;

                if(verifyJWT){
                    return res.json({
                        message: 'Token válido !',
                        id: verifyJWT.id,
                        username: verifyJWT.username,
                        email: verifyJWT.email,
                        iat: verifyJWT.iat,
                        exp: verifyJWT.exp
                    });
                }
            }
            catch(error){
                res.json({message: 'Token inválido ou expirado !'});
            }
                
        }
        else{
            res.redirect('/login');
        }

        next();
    }

    async onlyReturnData(req: Request, res: Response){
        const searchUser = await AccountRepository.findOneBy({username: 'testeee'});

        if(searchUser){
            return res.json({testekkkk: searchUser});
        }
    }
}