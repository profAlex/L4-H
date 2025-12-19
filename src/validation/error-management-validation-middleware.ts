// import {ErrorFormatter, FieldValidationError, ValidationError, validationResult} from "express-validator";
import { HttpStatus } from "../core/http-statuses";
import { NextFunction, Request, Response } from 'express';
// import { Request } from 'express';
import {ErrorFormatter, FieldValidationError, ValidationError, validationResult} from 'express-validator';

// import { ValidationError, validationResult } from 'express-validator';

type ValidationErrorType = {
    message: string;
    field: string;
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        message: String(expressError.msg),
        field: expressError.path,
    };
};

export const inputErrorManagementMiddleware = (
    req: Request<{},{},{},{}>,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

    if (errors.length > 0) {
        // console.log("WE GOT HERE FOR SOME REASON??");
        // console.log(errors); //для отладки, иначе непонятно где смотреть ошибки в случае их возникновения
        // if(errors[0].message.toLowerCase().includes('not found')) {
        //     // console.log(errors[0].message);
        //
        //     res.status(HttpStatus.NotFound).json({ errorsMessages: errors });
        //     //return;
        // }
        // else if (errors[0].message.toLowerCase().includes('invalid')) {
        //     // console.log(errors[0].message);
        //
        //     res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        //     //return;
        // }

        // console.log(errors[0].message);
        console.error(`Error ${HttpStatus.BadRequest}: ${errors[0].message}`);
        res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
        //return;
    }

    next();
};