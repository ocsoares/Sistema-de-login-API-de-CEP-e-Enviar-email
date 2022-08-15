import axios from "axios";
import { NextFunction, Request, Response } from "express";

export const runAxios = () => (req: Request, res: Response, next: NextFunction) => {
    if(req.session?.login){
        
        const getCEPValue = req.session?.login.cep.replace('-', ''); // Acho que NÃO precisava, Porque MESMO com - FUNCIONA !! (só por precaução...)
    
        const url = `https://viacep.com.br/ws/${getCEPValue}/json`;
    
        axios.get(url)
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
            .catch(error => console.log(`Erro na aplicaçãooo: ${error}`));
        
        next();
    }

    else{
        
        res.redirect('/login');
    }
}