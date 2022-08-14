import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export class StatusServerController{
    async checkStatusServer(req: Request, res: Response){
        res.status(StatusCodes.OK).json({message: 'Servidor online !'});
    }
}