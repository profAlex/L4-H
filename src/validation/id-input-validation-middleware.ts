import { param } from "express-validator";


export const inputIdValidation = param('id')
    .exists().withMessage('ID must be specified')
    .isString().withMessage('ID must be of type string')
    .trim()
    .isLength({ min: 1 }).withMessage('ID must not be empty')
    //.isMongoId().withMessage('ID must be of valid mongo-type')
