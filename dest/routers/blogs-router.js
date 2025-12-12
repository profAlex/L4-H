"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blog_router_description_1 = require("./router handlers/blog-router-description");
const BlogInputModel_validation_middleware_1 = require("../validation/BlogInputModel-validation-middleware");
const error_management_validation_middleware_1 = require("../validation/error-management-validation-middleware");
const id_input_validation_middleware_1 = require("../validation/id-input-validation-middleware");
const base64_auth_guard_middleware_1 = require("../validation/base64-auth-guard_middleware");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', blog_router_description_1.getAllBlogs);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
exports.blogsRouter.post('/', base64_auth_guard_middleware_1.superAdminGuardMiddleware, BlogInputModel_validation_middleware_1.blogInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.createNewBlog); //auth guarded
exports.blogsRouter.get('/:id', id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.findSingleBlog);
// inputErrorManagementMiddleware два раза или один? проверить!
exports.blogsRouter.put('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, /*inputErrorManagementMiddleware,*/ BlogInputModel_validation_middleware_1.blogInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.updateBlog); //auth guarded
exports.blogsRouter.delete('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.deleteBlog); //auth guarded
