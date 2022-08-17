import express, { Request, Response, Router } from "express";
import path from "path";
import session from 'cookie-session'
import bodyParser from "body-parser";
import { HTMLAccountController } from "../controllers/HTMLAccountController";
import { runAxios } from "../scripts/axios-script";
import { sendNodemailer } from "../scripts/nodemailer-script";

const __dirname = path.resolve()
const registerHTML = path.join(__dirname, '/src/html/register.html'); 
const registerSuccessufullHTML = path.join(__dirname, '/src/html/registerSuccessufull.html'); 
const loginHTML = path.join(__dirname, '/src/html/login.html');
const homeHTML = path.join(__dirname, '/src/html/home.html');
const logoutHTML = path.join(__dirname, '/src/html/logout.html');
const dashboardHTML = path.join(__dirname, '/src/html/dashboard.html');

const htmlPageRoute = Router();

// IMPORTANTE: Para Autenticação, usar POST ao invés de GET por + Segurança, um desses Motivos são que com GET os Dados do Input ficam ex-
// -postos na URL !! <<

// Procurar sobre views (EJS, engine) DEPOIS !! <<

// VER SE NO HEROKU ESTÁ FUNCIONANDO O NODEMAILER !! <<<<<

// Se eu não conseguir usar os Cookies, usar JWT no lugar deles e Procurar se é uma boa prática !! <<

    // Tive que mudar de session para cookie-session por causa do Heroku, e por isso, tive que Mudar os req.session... !! <<
htmlPageRoute.use(session({
    name: 'session_teste',    // <- O name PADRÃO é session !! <<  
    secret: process.env.SESSION_SECRET as string || 'sdjiofjois', // Chave para Autenticar a session !! <<
    keys: [process.env.SESSION_SECRET as string, 'dsdad', 'kkk', 'fodase....', 'aiojiofjfiod'],
    // secure: true, // esse secure ta fazendo n pegar local <
    // sameSite: 'none', // esse tb <
    // sameSite: 'none',
    // path: '/',
    // secure: process.env.NODE_ENV === 'production' ? true: false,

    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
    secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'

    // httpOnly: true,
    // maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days    
    // cookie: {
    //     secure: false,
    //     maxAge: 60000
    // },
    // resave: true, // Coloquei assim para Evitar um Erro << 
    // saveUninitialized: true // Coloquei assim para Evitar um Erro << 
}))

htmlPageRoute.use(bodyParser.urlencoded({extended: true})) // Permite pegar o req.body do Input do Usuário !! <

htmlPageRoute.get('/', (req: Request, res: Response) => {
    res.sendFile(homeHTML);
})

htmlPageRoute.get('/register', (req: Request, res: Response) => {
    res.sendFile(registerHTML);                                 
})

htmlPageRoute.post('/register', new HTMLAccountController().createAccountHTML as any, sendNodemailer(), (req: Request, res: Response) => {
    res.sendFile(registerSuccessufullHTML);
})

htmlPageRoute.get('/login', (req: Request, res: Response) => {
    if(req.session?.login){
        res.redirect('/dashboard');
    }
    else{
        res.sendFile(loginHTML);
    }
})
        // >> IMPORTANTE: Mesmo que NÃO utilize o req e o res, TEM que colocar SENÃO (ao menos no .post) DÁ ERRO !! <<
htmlPageRoute.post('/login', new HTMLAccountController().loginAccountHTML as any, (req: Request, res: Response) => {
    console.log('LOGADO !!!!');
    console.log('REQ LOGIN:', req.session?.login);
})

htmlPageRoute.get('/dashboard', (req: Request, res: Response) => {
    if(req.session?.login){
        res.sendFile(dashboardHTML);
    }
    else{
        res.redirect('/login');
    }
})

    // Realmente destrói a Sessão, MAS a Primeira vez nessa Rota dá o erro Internal Server Erro (mas Destrói), a partir da Segunda vai Normalmente !! <<
htmlPageRoute.get('/logout', (req: Request, res: Response) => {
    if(req.session?.login){
        res.clearCookie('session'); // Limpando o cookie com o nome PADRÃO que eu Criei acima !! <<
        res.sendFile(logoutHTML);
        
        setInterval(() => { // Coloquei isso aqui porque o res.sendFile é ASSÍNCRONO, e o res.end é SÍNCRONO, então Sempre Executava res.end ANTES do res.sendFile e bugava !! <<<
            res.end() // Impede que qualquer OUTRO dado seja escrito (pelo oq entendi...)
        }, 25)
        
    }

    else{
        res.redirect('/');
    }

})

htmlPageRoute.get('/email', (req: Request, res: Response) => {
    if(req.session?.login){
        res.json({name: req.session.login.username, email: req.session.login.email});
    }
    else{
        res.redirect('/login');
    }

})

htmlPageRoute.get('/cep', runAxios(), (req: Request, res: Response) => {
})

    // Tive que usar um Middleware porque com req.jwt na ROTA estava dando Undefined !!! <<<
htmlPageRoute.get('/token', new HTMLAccountController().generateJWT, (req: Request, res: Response) => {
})

htmlPageRoute.get('/verifytoken/:JWTObject', new HTMLAccountController().verifyJWT, (req: Request, res: Response) => {
})

htmlPageRoute.get('/data', new HTMLAccountController().onlyReturnData, (req: Request, res: Response) => {
})

export default htmlPageRoute;