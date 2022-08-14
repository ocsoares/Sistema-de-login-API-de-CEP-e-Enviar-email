import 'dotenv/config'
import express from 'express';
import { AppDataSource } from './database';
import { errorMiddleware } from './middlewares/error.middleware';
import checkStatusRoute from './routes/check-status.route';
import htmlPageRoute from './routes/html-pages.route';
import path from 'path';
import cors from 'cors'

// IMPORTANTE: Por algum motivo NÃO estava encontrando o 'process' de .env, então Resolvi alterando em 'types' no tsconfig.json colo-
// -cando "types": ["node"] !! <<

// IMPORTANTE: Para Compilar de .ts para .js Usando Babel usei o comando:
// 1 - npm build - Está com nodemon para Atualizar a cada Modificação, e o Arquivo FINAL (.js) sairá em /dist/script-html !! <<<
// 2 - browserify:run - Mudar MANUALMENTE o Nome dos Arquivos (Entrada e Saída) no package.json, porque ele só Transpila UM por Vez (Também po-
// de juntar VÁRIOS Arquivos em apenas UM, se precisar...) !! <<<
// 3 - Usar o .js FEITO Pelo browserify:run no HTML em <script> !!! <<<

// Para resolver o erro: "Error: Can't walk dependency graph: Cannot find module '...' from ...", COLOCAR no script do browserify ./ na PAS-
// -TA >Inicial< !! <<<

// Para resolver o Erro: "Cannot find the name 'document'. Do you need to change your target library? Try changing the compiler's 'lib' opti-
// -on to include 'dom'.ts(2584)" adicionei "DOM" em "lib" no tsconfig.json e Recarreguei a Janela do VSCode !! <<

// Depois procurar sobre render e views (Nodejs) !! <<

AppDataSource.initialize().then(() => {
    const server = express();
    
    const host = 'http://localhost';
    const port = 5000;

    const __dirname = path.resolve();
    
    server.use(cors());
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
    server.use(express.static(__dirname + '/src/public')) // CSS do Diretório: /src/public/css/styles.css
    server.use(express.static(__dirname + '/fontawesome-free-6.1.2-web/')) // CSS do Diretório: /fontawesome-free-6.1.2-web/css/all.min.css"
    server.use(express.static(__dirname + '/dist'))
    
    server.use(htmlPageRoute);
    server.use(checkStatusRoute);
    // server.use(crudRoute); POR ENQUANTO vou deixar isso Comentado, porque irei mexer APENAS com a Rota de HTML !! <<

    server.use(errorMiddleware);

    return server.listen(port, () => {
        console.log(`Servidor online na rota: ${host}:${port} !`);
    })
})