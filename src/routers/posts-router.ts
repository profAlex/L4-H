import {Request, Response, Router} from 'express';
import {
    createNewPost,
    deletePost,
    findSinglePost,
    getAllPosts,
    updatePost
} from "./router descriptions/post-router-description";

import {postInputModelValidation} from "../validation/PostInputModel-validation-middleware";
import {inputErrorManagementMiddleware} from "../validation/error-management-validation-middleware";
import {inputIdValidation} from "../validation/id-input-validation-middleware";
import {superAdminGuardMiddleware} from "../validation/base64-auth-guard_middleware";

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
postsRouter.post('/', superAdminGuardMiddleware, postInputModelValidation, inputErrorManagementMiddleware, createNewPost); //auth guarded
postsRouter.get('/:id', inputIdValidation, inputErrorManagementMiddleware, findSinglePost);
//inputErrorManagementMiddleware можно один раз или надо два раза?
postsRouter.put('/:id', superAdminGuardMiddleware, inputIdValidation, /*inputErrorManagementMiddleware,*/ postInputModelValidation, inputErrorManagementMiddleware, updatePost); //auth guarded
postsRouter.delete('/:id', superAdminGuardMiddleware, inputIdValidation, inputErrorManagementMiddleware, deletePost) //auth guarded