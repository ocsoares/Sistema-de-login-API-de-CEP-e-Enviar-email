import 'reflect-metadata'
import 'dotenv/config'
import { DataSource } from 'typeorm'

// ALERTA: MUDEI DE Login-system  PARA  login-system   (l minúsculo) PARA VER SE PEGA !!! <<
//  OBS: no .env Também !! <<

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,

    // host:  process.env.DB_HOST,
    // port:  Number(process.env.DB_PORT),
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_NAME,

    entities: [`${__dirname}/**/entity/*.{ts,js}`],
    migrations: [`${__dirname}/**/migration/*.{ts,js}`]
});