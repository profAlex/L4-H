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
import {createIdValidator} from "../validation/id-verification-and-validation";
import {db} from "../db/mongo.db";

export const postsRouter = Router();

const validateBlogId4 = createIdValidator({
    paramKey: IdParamName.Id,
    collectionName: CollectionNames.Posts,
    database: db,
});

postsRouter.get('/', getAllPosts);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
postsRouter.post('/', superAdminGuardMiddleware, postInputModelValidation, inputErrorManagementMiddleware, createNewPost); //auth guarded
postsRouter.get('/:id', validateBlogId4, inputErrorManagementMiddleware, findSinglePost);
//inputErrorManagementMiddleware можно один раз или надо два раза?
postsRouter.put('/:id', superAdminGuardMiddleware, validateBlogId4, /*inputErrorManagementMiddleware,*/ postInputModelValidation, inputErrorManagementMiddleware, updatePost); //auth guarded
postsRouter.delete('/:id', superAdminGuardMiddleware, validateBlogId4, inputErrorManagementMiddleware, deletePost) //auth guarded