"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputErrorManagementMiddleware = void 0;
const express_validator_1 = require("express-validator");
const http_statuses_1 = require("../core/http-statuses");
const formatErrors = (error) => {
    const expressError = error;
    return {
        message: expressError.msg,
        field: expressError.path,
    };
};
const inputErrorManagementMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).formatWith(formatErrors).array({ onlyFirstError: true });
    if (errors.length > 0) {
        // console.log(errors); //для отладки, иначе непонятно где смотреть ошибки в случае их возникновения
        res.status(http_statuses_1.HttpStatus.BadRequest).json({ errorsMessages: errors });
        return;
    }
    next();
};
exports.inputErrorManagementMiddleware = inputErrorManagementMiddleware;
