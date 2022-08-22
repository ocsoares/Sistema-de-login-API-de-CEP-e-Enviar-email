// Tive que fazer assim, desse jeito, nesse Esquema de Pasta, e Adicionando em tsconfig.json (ACHO que NÃO mudou nada Adicionar ./node_modules/@types),
// para dar Certo, do outro jeito NÃO DEU !! <<<<

declare namespace Express {
    interface Request {
      login: any 
      fullLogin: any
      teste: any
      userLogged: any
      axios: string | object
    }
  }