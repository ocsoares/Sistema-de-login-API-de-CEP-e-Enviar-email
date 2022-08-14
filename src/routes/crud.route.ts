import { Router } from "express";
import { AccountController } from "../controllers/AccountController";

const crudRoute = Router()

crudRoute.post('/register', new AccountController().createAccount);

export default crudRoute;