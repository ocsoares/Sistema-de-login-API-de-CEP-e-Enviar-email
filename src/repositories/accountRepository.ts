import { AppDataSource } from "../database";
import { Account } from "../database/src/entity/Account";

export const AccountRepository = AppDataSource.getRepository(Account);