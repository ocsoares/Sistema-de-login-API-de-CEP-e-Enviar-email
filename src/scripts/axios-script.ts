import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../models/api-error.model";
import { redisClient } from "../redisConfig";
import { AccountRepository } from "../repositories/accountRepository";

export const runAxios = () => async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.login

            // Internal Server Error porque como ele JÁ ESTÁ LOGADO (pois PASSOU no Middleware de Cookie e logo o ID e outras Informações EXISTEM), 
            // então a Única forma de dar Erro é se der algum problema Interno no SERVIDOR !! <<
        if(!id) throw new InternalServerError('ID não encontrado !');

        const searchUserByID = await AccountRepository.findOneBy({id})

        if(!searchUserByID) throw new InternalServerError('Usuário não encontrado !');

        const CEPValue = searchUserByID.cep;
        
        const fixCEPValue = CEPValue.replace('-', ''); // Acho que NÃO precisava, Porque MESMO com - FUNCIONA !! (só por precaução...)
    
        const url = `https://viacep.com.br/ws/${fixCEPValue}/json`;
    
        console.time();

            // Como o Cache, se existir, foi Guardado em STRING, transformar DE VOLTA em JSON !! <<
            // A CHAVE (nesse caso, fixCEPValue), vai ser usada nesse caso para Buscar o VALOR dela, Determinado no .set !! <<
        const isCached = await redisClient.get(fixCEPValue);

        if(isCached){ 
            console.log('CACHE JÁ EXISTE !');
            console.log('CONTEUDO:', JSON.parse(isCached));
            console.timeEnd();

                // Como foi Cacheado em String (PRECISA ser), agora Precisa VOLTAR para JSON !! <<
            return res.json(JSON.parse(isCached));
        }

            await axios.get(url, {withCredentials: true})
            .then(resAxios => { // o resAxios estava com o MESMO nome do res (Response - Express), POR ISSO NÃO estava permitindo usar as propriedades do Response Express !! <<
                const { ...getAllData } = resAxios.data // Pegando TUDO do res.data nessa ...Variável <<<  
                
                // req.axios = resAxios.data
                // console.log('FODASE', req.axios)
                
                const checkErrorAPI = getAllData.hasOwnProperty('erro');
                
                if (!checkErrorAPI) {
                    req.axios = resAxios.data
                    return res.json(resAxios.data);
                }

                else{
                   return res.json({message: 'CEP inválido !'});
                }
            })
            .catch(error => console.log(`Erro na aplicação: ${error}`));

            console.log('CACHE NÃO EXISTE !!');

                //A Chave vai ser baseada no CEP, e o Valor a ser Cacheado vai ser o Retorno da API (que Retorna um JSON) !! <<
                //  OBS: Para guardar no Cache, precisa Transformar o JSON em String !!! <<<  
            const redisExpires = 24 * 60 * 60; // 1 day

            redisClient.set(fixCEPValue, JSON.stringify(req.axios), 'EX', redisExpires);
        
        console.timeEnd();

        next();
}