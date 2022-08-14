import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { BadRequestError } from "../models/api-error.model";
import { AccountRepository } from "../repositories/accountRepository";
import { CPFRepository } from "../repositories/CPFRepository";
import { StatusCodes } from "http-status-codes";

export class AccountController{ 
    async createAccount(req: Request, res: Response){ // Salvar CONTA em um e NAME e CPF em OUTRO !! <<
        const { username, password, email, cpf, cep } = req.body

        if(!username || !password || !email || !cpf || !cep) throw new BadRequestError('Insira os dados corretamente !');
        if(typeof(username) !== 'string' || typeof(password) !== 'string' || typeof(email) !== 'string' || typeof(cpf) !== 'string'|| typeof(cep) !== 'string') throw new BadRequestError('Formato inválido !');

        const searchCPF = await CPFRepository.findOneBy({cpf})

        if(searchCPF) throw new BadRequestError('Já existe um usuário cadastrado com esse Email ou CPF !');

        const searchEmail = await AccountRepository.findOneBy({email})

        if(searchEmail) throw new BadRequestError('Já existe um usuário cadastrado com esse Email ou CPF !');

        const encryptPassword = await bcrypt.hash(password, 10)

        if(!encryptPassword) throw new BadRequestError();
        
        const saveCreatedAccount = AccountRepository.create({
            username,
            email,
            cep,
            password: encryptPassword
        })

        const saveNameAndCPF = CPFRepository.create({
            name: username,
            cpf
        })

        await AccountRepository.save(saveCreatedAccount);

        await CPFRepository.save(saveNameAndCPF);

        return res.status(StatusCodes.CREATED).json({message: `Usuário ${username} criado com sucesso !`});
    }
}