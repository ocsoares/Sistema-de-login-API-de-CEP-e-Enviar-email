import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm'

// ALERTA: MUDEI DE Login-system  PARA  login-system   (l minúsculo) PARA VER SE PEGA !!! <<
//  OBS: no .env Também !! <<

// Adicionei # TYPE DATABASE USER CIDR-ADDRESS  METHOD // host  all  all 0.0.0.0/0 md5 no pg_hba.conf !! <<

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,

    // host:  process.env.DB_HOST,
    // port:  Number(process.env.DB_PORT),
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,

    entities: [`${__dirname}/**/entity/*.{ts,js}`],
    migrations: [`${__dirname}/**/migration/*.{ts,js}`],


        // Isso aqui permite Acessar LOCALMENTE e REMOTAMENTE, de acordo com o .env NODE_ENV !!
        // O NODE_ENV Apenas existe no HEROKU (Remoto) e Retorna production, no localhost NÃO EXISTE !! <<
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});