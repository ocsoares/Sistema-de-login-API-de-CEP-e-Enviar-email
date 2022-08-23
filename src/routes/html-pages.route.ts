import { NextFunction, Request, Response, Router } from "express";
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
const dashboardHTML = path.join(__dirname, '/src/html/dashboard.html');

const htmlPageRoute = Router();

// IMPORTANTE: Para Autenticação, usar POST ao invés de GET por + Segurança, um desses Motivos são que com GET os Dados do Input ficam ex-
// -postos na URL !! <<

// Procurar sobre views (EJS, engine) DEPOIS !! <<

// Se eu não conseguir usar os Cookies, usar JWT no lugar deles e Procurar se é uma boa prática !! <<

// Pesquisar sobre Criptografia em JWT !! <<

// >>> FAZER um Sistema simples para Cadastrar/Deletar Tópicos (igual em um Blog) !! <<<<<

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

htmlPageRoute.get('/login', new HTMLAccountController().BlockHTMLPageIfLooged, (req: Request, res: Response) => {
        res.sendFile(loginHTML);
})
        // >> IMPORTANTE: Mesmo que NÃO utilize o req e o res, TEM que colocar SENÃO (ao menos no .post) DÁ ERRO !! <<
htmlPageRoute.post('/login', new HTMLAccountController().loginAccountHTML as any, (req: Request, res: Response) => {
})

htmlPageRoute.get('/dashboard', new HTMLAccountController().checkJWTCookie,  (req: Request, res: Response, next: NextFunction) => {
        res.sendFile(dashboardHTML);
})

htmlPageRoute.get('/logout', new HTMLAccountController().checkJWTCookie, new HTMLAccountController().logoutAccountHTML, (req: Request, res: Response) => {
})

    // Nesse caso o req.login FUNCIONOU porque está com o MIDDLEWARE que ele foi Definido !! <<
htmlPageRoute.get('/email', new HTMLAccountController().checkJWTCookie, (req: Request, res: Response) => {
    res.json({
        username: req.login.username,
        email: req.login.email
    });
})

htmlPageRoute.get('/cep', new HTMLAccountController().checkJWTCookie, runAxios(), (req: Request, res: Response) => {
    // console.log('req.login:', req.login);
    // console.log('req.userCEP:', req.userCEP);
})

export default htmlPageRoute;