"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blog_router_description_1 = require("./router handlers/blog-router-description");
const BlogInputModel_validation_middleware_1 = require("../validation/BlogInputModel-validation-middleware");
const error_management_validation_middleware_1 = require("../validation/error-management-validation-middleware");
const id_input_validation_middleware_1 = require("../validation/id-input-validation-middleware");
const base64_auth_guard_middleware_1 = require("../validation/base64-auth-guard_middleware");
const fields_for_sorting_1 = require("./util-enums/fields-for-sorting");
const blog_pagination_validator_1 = require("./blogs-validation-middleware/blog-pagination-validator");
const blogid_input_validation_middleware_1 = require("../validation/blogid-input-validation-middleware");
const PostInputModel_validation_middleware_1 = require("../validation/PostInputModel-validation-middleware");
const post_router_description_1 = require("./router handlers/post-router-description");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (0, blog_pagination_validator_1.inputPaginationValidator)(fields_for_sorting_1.BlogsSortListEnum), error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.getSeveralBlogs);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
exports.blogsRouter.post('/', base64_auth_guard_middleware_1.superAdminGuardMiddleware, BlogInputModel_validation_middleware_1.blogInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.createNewBlog); //auth guarded
exports.blogsRouter.get('/:blogId/posts', blogid_input_validation_middleware_1.inputBlogIdValidation, (0, blog_pagination_validator_1.inputPaginationValidator)(fields_for_sorting_1.BlogsSortListEnum), error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.getSeveralPostsFromBlog);
exports.blogsRouter.post('/:blogId/posts', base64_auth_guard_middleware_1.superAdminGuardMiddleware, blogid_input_validation_middleware_1.inputBlogIdValidation, PostInputModel_validation_middleware_1.postInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, post_router_description_1.createNewPost);
exports.blogsRouter.get('/:id', id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.findSingleBlog);
// inputErrorManagementMiddleware два раза или один? проверить!
exports.blogsRouter.put('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, /*inputErrorManagementMiddleware,*/ BlogInputModel_validation_middleware_1.blogInputModelValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.updateBlog); //auth guarded
exports.blogsRouter.delete('/:id', base64_auth_guard_middleware_1.superAdminGuardMiddleware, id_input_validation_middleware_1.inputIdValidation, error_management_validation_middleware_1.inputErrorManagementMiddleware, blog_router_description_1.deleteBlog); //auth guarded
