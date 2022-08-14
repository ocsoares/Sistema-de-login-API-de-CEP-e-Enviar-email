import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { ApiError } from "../models/api-error.model"

export const errorMiddleware = (error: Error & Partial<ApiError>, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.statusCode ? error.message: 'Internal Server Error'

    if(message){
        return res.status(statusCode).json({message})
    }

    return res.sendStatus(statusCode);
}