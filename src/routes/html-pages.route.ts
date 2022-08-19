import { Request, Response, Router } from "express";
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

// Pesquisar sobre Criptografia em JWT !! <<

// Pelo o que eu entendi, um Request só é válido QUANDO usado na Função OU NO MIDDLEWARE !! <<<<<

    // Tive que mudar de session para cookie-session por causa do Heroku, e por isso, tive que Mudar os req.session... !! <<
htmlPageRoute.use(session({
    name: 'session_app',    // <- O name PADRÃO é session !! <<  
    secret: process.env.SESSION_SECRET as string, // Chave para Autenticar a session !! <<
    keys: [process.env.SESSION_SECRET as string],
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' ? true: false,
    httpOnly: true, // true = IMPEDE que o Usuário MODIFIQUE o Cookie MANUALMENTE ( + Seguro !! ) !! <<
}))

htmlPageRoute.use(bodyParser.urlencoded({extended: true})) // Permite pegar o req.body do Input do Usuário !! <

htmlPageRoute.use(bodyParser.json());

htmlPageRoute.use(bodyParser.text({ type: 'text/json' }));

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
    // if(req.headers.cookie){
        // res.redirect('/dashboard');
    // }
    // else{
        res.sendFile(loginHTML);
    // }
})
        // >> IMPORTANTE: Mesmo que NÃO utilize o req e o res, TEM que colocar SENÃO (ao menos no .post) DÁ ERRO !! <<
htmlPageRoute.post('/login', new HTMLAccountController().loginAccountHTML as any, (req: Request, res: Response) => {
})

htmlPageRoute.get('/dashboard', new HTMLAccountController().checkJWTCookie,  (req: Request, res: Response) => {
    // if(req.headers.cookie){
        // console.log('REQ SeSSION:', req.session);
        // console.log('req header cookies', req.headers.cookie);
        // console.log('REQ BODY:', req.body);
        // console.log('req body no dashboard::', req.body.teste);
        // console.log('req session login', req.session?.login)
        // console.log('req headers any:', req.headers.any);
        console.log('req login no Dash', req.login);
        res.sendFile(dashboardHTML);
    // }
    // else{
        // res.redirect('/login');
    // }
})

    // Realmente destrói a Sessão, MAS a Primeira vez nessa Rota dá o erro Internal Server Erro (mas Destrói), a partir da Segunda vai Normalmente !! <<
htmlPageRoute.get('/logout', (req: Request, res: Response) => {
    if(req.headers.cookie){
        console.log('COOKIE NO LOGOUT:', req.headers.cookie);
        res.clearCookie('session_app'); // Limpando o cookie com o nome PADRÃO que eu Criei acima !! <<
        res.sendFile(logoutHTML);
        
        setInterval(() => { // Coloquei isso aqui porque o res.sendFile é ASSÍNCRONO, e o res.end é SÍNCRONO, então Sempre Executava res.end ANTES do res.sendFile e bugava !! <<<
            res.end() // Impede que qualquer OUTRO dado seja escrito (pelo oq entendi...)
        }, 25)
        
    }

    else{
        res.redirect('/');
    }

})

htmlPageRoute.get('/email', new HTMLAccountController().checkJWTCookie, (req: Request, res: Response) => {
    res.json({
        username: req.login.username,
        email: req.login.email
    });
})

htmlPageRoute.get('/cep', new HTMLAccountController().checkJWTCookie, runAxios(), (req: Request, res: Response) => {
})

    // >>>>> ACHO QUE NÃO VOU PRECISAR DESSAS ROTAS PRA BAIXO, POR SEGURANÇA, ÓBVIO !! <<<<<<<<   

    // Tive que usar um Middleware porque com req.jwt na ROTA estava dando Undefined !!! <<<
htmlPageRoute.get('/token', new HTMLAccountController().generateJWT, (req: Request, res: Response) => {
})

htmlPageRoute.get('/verifytoken/:JWTObject', new HTMLAccountController().verifyJWT, (req: Request, res: Response) => {
})

    // EXCLUIR depois...
htmlPageRoute.get('/data', new HTMLAccountController().onlyReturnData, (req: Request, res: Response) => {
})

export default htmlPageRoute;