import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { InternalServerError } from "../models/api-error.model";
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
    
        axios.get(url, {withCredentials: true})
            .then(resAxios => { // o resAxios estava com o MESMO nome do res (Response - Express), POR ISSO NÃO estava permitindo usar as propriedades do Response Express !! <<
                const { ...getAllData } = resAxios.data // Pegando TUDO do res.data nessa ...Variável <<<   
                
                const checkErrorAPI = getAllData.hasOwnProperty('erro');
                
                if (!checkErrorAPI) {
                    return res.json(resAxios.data);
                }

                else{
                   return res.json({message: 'CEP inválido !'});
                }
            })
            .catch(error => console.log(`Erro na aplicação: ${error}`));
        
        next();
}