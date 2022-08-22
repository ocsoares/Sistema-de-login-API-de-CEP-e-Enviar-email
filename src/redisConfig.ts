import Redis from 'ioredis';
import 'dotenv/config'

// INICIAR o Redis no Terminal (Linux) ANTES, com >redis-server< (COLOQUEI SENHA, aquela...) !!
// Após ter iniciado e ter acesso as suas Configurações no Terminal, usar redis-cli !! <<
//  OBS: Por algum motivo, o Server está iniciando mesmo com a Janela do Linux FECHADA !! <<

// TEM QUE Transformar os dados do Cache em STRING !! << 

const redisClient = new Redis({
    password: process.env.REDIS_PASS
})

redisClient.on('connect', () => {
    console.log('Redis conectado !');
})

redisClient.on('error', (error) => {
    console.log(error.message);
})

export { redisClient };