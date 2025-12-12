import {Request, Response, Router} from 'express';
import {
    createNewBlog,
    deleteBlog,
    findSingleBlog,
    getAllBlogs,
    updateBlog
} from "./router handlers/blog-router-description";
import {blogInputModelValidation} from "../validation/BlogInputModel-validation-middleware";
import {inputErrorManagementMiddleware} from "../validation/error-management-validation-middleware";
import {inputIdValidation} from "../validation/id-input-validation-middleware";
import {superAdminGuardMiddleware} from "../validation/base64-auth-guard_middleware";
import {SortListEnum} from "./util-enums/fields-for-sorting";
import {inputPaginationValidator} from "./blogs-validation-middleware/blog-pagination-validator";

export const blogsRouter = Router();

blogsRouter.get('/', inputPaginationValidator(SortListEnum), inputErrorManagementMiddleware, getAllBlogs);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
blogsRouter.post('/', superAdminGuardMiddleware, blogInputModelValidation, inputErrorManagementMiddleware, createNewBlog); //auth guarded
blogsRouter.get('/:id', inputIdValidation, inputErrorManagementMiddleware, findSingleBlog);
// inputErrorManagementMiddleware два раза или один? проверить!
blogsRouter.put('/:id', superAdminGuardMiddleware, inputIdValidation, /*inputErrorManagementMiddleware,*/ blogInputModelValidation, inputErrorManagementMiddleware, updateBlog); //auth guarded
blogsRouter.delete('/:id', superAdminGuardMiddleware, inputIdValidation, inputErrorManagementMiddleware, deleteBlog); //auth guarded



