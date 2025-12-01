import { FieldValidationError, ValidationError, validationResult } from "express-validator";
import { HttpStatus } from "../core/http-statuses";
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorType } from "../core/validation-errors";


const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        message: expressError.msg,
        field: expressError.path,
    };
};

export const inputErrorManagementMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

    if (errors.length > 0) {
        console.log("WE GOT HERE FOR SOME REASON??");
        // console.log(errors); //для отладки, иначе непонятно где смотреть ошибки в случае их возникновения

        res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }

    next();
};