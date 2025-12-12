"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const post_router_description_1 = require("./router handlers/post-router-description");
const PostInputModel_validation_middleware_1 = require("../validation/PostInputModel-validation-middleware");
const error_management_validation_middleware_1 = require("../validation/error-management-validation-middleware");
const id_input_validation_middleware_1 = require("../validation/id-input-validation-middleware");
const base64_auth_guard_middleware_1 = require("../validation/base64-auth-guard_middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', post_router_description_1.getAllPosts);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
exports.postsRouter.post('/', base64_auth_guard_middleware_1.superAdminGuardMiddleware, PostInputModel_validation_middleware_1.postInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.createNewPost); //auth guarded
exports.postsRouter.get('/:id', id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.findSinglePost);
//inputErrorManagementMiddleware можно один раз или надо два раза?
exports.postsRouter.put('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, /*inputErrorManagementMiddleware,*/ PostInputModel_validation_middleware_1.postInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.updatePost); //auth guarded
exports.postsRouter.delete('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.deletePost); //auth guarded
