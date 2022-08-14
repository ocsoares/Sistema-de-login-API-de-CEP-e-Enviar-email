import { AppDataSource } from "../database";
import { CPF } from "../database/src/entity/CPF";

export const CPFRepository = AppDataSource.getRepository(CPF);