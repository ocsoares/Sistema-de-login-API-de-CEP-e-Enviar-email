import Redis from 'ioredis';
import 'dotenv/config'

// INICIAR o Redis no Terminal (Linux) ANTES, com >redis-server< (COLOQUEI SENHA, aquela...) !!
// Após ter iniciado e ter acesso as suas Configurações no Terminal, usar redis-cli !! <<
//  OBS: Por algum motivo, o Server está iniciando mesmo com a Janela do Linux FECHADA !! <<

// TEM QUE Transformar os dados do Cache em STRING !! << 

// Comandos do redis-cli !! <<
// MONITOR = Permite ver em Tempo REAL o Funcionamento dos Caches 
// KEYS * = Mostra TODAS as CHAVES Cacheadas

const redisClient = new Redis({
    password: process.env.REDIS_PASS
})

if(process.env.NODE_ENV === 'production'){
    console.log('Redis desabilitado no Heroku (Colocarei mais a frente...)');
}

else{
    redisClient.on('connect', () => {
        console.log('Redis conectado !');
    })
    
    redisClient.on('error', (error) => {
        console.log(error.message);
    })
}

export { redisClient };