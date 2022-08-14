import { Request, Response, Router } from "express";
import path from "path";
import session from 'express-session'
import bodyParser from "body-parser";
import { HTMLAccountController } from "../controllers/HTMLAccountController";
import { runAxios } from "../scripts/axios-script";
import { sendNodemailer } from "../scripts/nodemailer-script";

const __dirname = path.resolve()
const registerHTML = path.join(__dirname, '/src/html/register.html'); 
const registerSuccessufullHTML = path.join(__dirname, '/src/html/registerSuccessufull.html'); 
const loginHTML = path.join(__dirname, '/src/html/login.html');
const loggedHTML = path.join(__dirname, '/src/html/loginSuccessufull.html');
const homeHTML = path.join(__dirname, '/src/html/home.html');
const logoutHTML = path.join(__dirname, 'src/html/logout.html');

const htmlPageRoute = Router();

htmlPageRoute.use(session({
    secret: process.env.SESSION_SECRET as string, // Chave para Autenticar a session !! <<
    resave: true, // Coloquei assim para Evitar um Erro << 
    saveUninitialized: true // Coloquei assim para Evitar um Erro << 
}))

// IMPORTANTE: Para Autenticação, usar POST ao invés de GET por + Segurança, um desses Motivos são que com GET os Dados do Input ficam ex-
// -postos na URL !! <<

htmlPageRoute.use(bodyParser.urlencoded({extended: true})) // Permite pegar o req.body do Input do Usuário !! <<

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
    if(req.session.login){
        res.redirect('/')
    }
    else{
        res.sendFile(loginHTML);
    }
})
        // >> IMPORTANTE: Mesmo que NÃO utilize o req e o res, TEM que colocar SENÃO (ao menos no .post) DÁ ERRO !! <<
htmlPageRoute.post('/login', new HTMLAccountController().loginAccountHTML as any, (req: Request, res: Response) => {
})

    // Realmente destrói a Sessão, MAS a Primeira vez nessa Rota dá o erro Internal Server Erro (mas Destrói), a partir da Segunda vai Normalmente !! <<
htmlPageRoute.get('/logout', (req: Request, res: Response) => {
    if(req.session.login){
        req.session.destroy(req.session.login);
        res.sendFile(logoutHTML);
    }

    else{
        res.redirect('/');
    }

})

htmlPageRoute.get('/email', (req: Request, res: Response) => {
    if(req.session.login){
        res.json({message: 'EXISTE !', session: req.session.login});
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

export default htmlPageRoute;