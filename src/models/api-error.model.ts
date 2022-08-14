import { StatusCodes } from "http-status-codes";

export class ApiError extends Error{
    public readonly statusCode: number
    constructor(message: string | undefined, statusCode: number){
        super(message);
        this.statusCode = statusCode
        this.name = 'ErrorAPI'
    }
}

export class BadRequestError extends ApiError{
    constructor(message?: string){
        super(message, StatusCodes.BAD_REQUEST);
        this.name = 'ErrorBadRequest'
    }
}

export class NotFoundError extends ApiError{
    constructor(message?: string){
        super(message, StatusCodes.NOT_FOUND);
        this.name = 'ErrorNotFound'
    }
}

export class UnauthorizedError extends ApiError{
    constructor(message?: string){
        super(message, StatusCodes.UNAUTHORIZED);
        this.name = 'ErrorUnauthorized'
    }
}

export class InternalServerError extends ApiError{
    constructor(message?: string){
        super(message, StatusCodes.INTERNAL_SERVER_ERROR);
        this.name = 'ErrorInternalServer'
    }
}