import {Request, Response, Router} from 'express';
import {
    createNewPost,
    deletePost,
    findSinglePost,
    getAllPosts,
    updatePost
} from "./router handlers/post-router-description";

import {postInputModelValidation} from "../validation/PostInputModel-validation-middleware";
import {inputErrorManagementMiddleware} from "../validation/error-management-validation-middleware";
import {superAdminGuardMiddleware} from "../validation/base64-auth-guard_middleware";
import {IdParamName} from "./blogs-router";
import {CollectionNames} from "../repository/collection-names";
import {inputIdValidationVerification} from "../validation/id-verification-and-validation";

export const postsRouter = Router();

postsRouter.get('/', getAllPosts);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
postsRouter.post('/', superAdminGuardMiddleware, postInputModelValidation, inputErrorManagementMiddleware, createNewPost); //auth guarded
postsRouter.get('/:id', inputIdValidationVerification(CollectionNames.Posts), inputErrorManagementMiddleware, findSinglePost);
//inputErrorManagementMiddleware можно один раз или надо два раза?
postsRouter.put('/:id', superAdminGuardMiddleware, inputIdValidationVerification(CollectionNames.Posts), /*inputErrorManagementMiddleware,*/ postInputModelValidation, inputErrorManagementMiddleware, updatePost); //auth guarded
postsRouter.delete('/:id', superAdminGuardMiddleware, inputIdValidationVerification(CollectionNames.Posts), inputErrorManagementMiddleware, deletePost) //auth guarded