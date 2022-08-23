import Redis from 'ioredis';
import 'dotenv/config'

// INICIAR o Redis no Terminal (Linux) ANTES, com >redis-server< (COLOQUEI SENHA, aquela...) !!
// Após ter iniciado e ter acesso as suas Configurações no Terminal, usar redis-cli !! <<
//  OBS: Por algum motivo, o Server está iniciando mesmo com a Janela do Linux FECHADA !! <<

// TEM QUE Transformar os dados do Cache em STRING !! << 

// Comandos do redis-cli !! <<
// MONITOR = Permite ver em Tempo REAL o Funcionamento dos Caches 
// KEYS * = Mostra TODAS as CHAVES Cacheadas


const redisClient = new Redis(process.env.REDIS_TLS_URL as any || 'localhost', {
    password: undefined || process.env.REDIS_PASS, // REDIS_PASS = Senha local
    tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } as any : false 
});


// const redisClient = new Redis(process.env.NODE_ENV === 'production' ? process.env.REDIS_URL : 'localhost' as any, {
//     password: process.env.NODE_ENV === 'production' ? false : process.env.REDIS_PASS as any,

//     tls: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false as any
// })

redisClient.on('connect', () => {
    console.log('Redis conectado !');

    if(process.env.NODE_ENV === 'production'){
        console.log('Conectado remotamente no Redis do Heroku !');
    }
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

export { redisClient };