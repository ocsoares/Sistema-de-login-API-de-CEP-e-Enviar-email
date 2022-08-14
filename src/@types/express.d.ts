// IMPORTANTE: Adicionar no tsconfig o Diretório da >PASTA< da MINHA Biblioteca CRIADA de Tipos = typeRoots["diretório..."] !!! <<<<<

import { Account } from "../database/src/entity/Account"

declare global {
    namespace Express {
        export interface Request {
            user: Partial<Account> 

            jwt: string
        }
    }
}
declare module 'express-session'{
    export interface SessionData{
        login: any
    }
}