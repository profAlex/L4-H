import {Request, Response, Router} from 'express';
import {
    createNewBlog, createNewBlogPost,
    deleteBlog,
    findSingleBlog,
    getSeveralBlogs, getSeveralPostsFromBlog,
    updateBlog
} from "./router handlers/blog-router-description";
import {blogInputModelValidation} from "../validation/BlogInputModel-validation-middleware";
import {inputErrorManagementMiddleware} from "../validation/error-management-validation-middleware";
import {superAdminGuardMiddleware} from "../validation/base64-auth-guard_middleware";
import {BlogsSortListEnum, PostsSortListEnum} from "./util-enums/fields-for-sorting";
import {
    inputPaginationValidator,
    inputPaginationValidator2
} from "./blogs-validation-middleware/blog-pagination-validator";
import {inputBlogIdValidation} from "../validation/blogid-input-validation-middleware";
import {
    blogRoutesPostInputModelValidation,
    postInputModelValidation
} from "../validation/PostInputModel-validation-middleware";
import {CollectionNames} from "../repository/collection-names";
import {
    createIdValidator,
} from "../validation/id-verification-and-validation";
import {InputGetBlogPostsByIdQuery} from "./router-types/blog-search-by-id-input-model";
import {db} from "../db/mongo.db";
// import {inputIdValidationVerification} from "../validation/id-input-validation-middleware";

export const blogsRouter = Router();

export enum IdParamName {
    Id = 'id',
    BlogId = 'blogId',
}

const validateBlogId = createIdValidator<'blogId', InputGetBlogPostsByIdQuery>({
    paramKey: IdParamName.BlogId,
    collectionName: CollectionNames.Blogs,
    database: db,
});

const validateBlogId2 = createIdValidator({
    paramKey: IdParamName.BlogId,
    collectionName: CollectionNames.Blogs,
    database: db,
});

const validateBlogId3 = createIdValidator({
    paramKey: IdParamName.Id,
    collectionName: CollectionNames.Blogs,
    database: db,
});


blogsRouter.get('/', inputPaginationValidator(BlogsSortListEnum), inputErrorManagementMiddleware, getSeveralBlogs);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
blogsRouter.post('/', superAdminGuardMiddleware, blogInputModelValidation, inputErrorManagementMiddleware, createNewBlog); //auth guarded

blogsRouter.get('/:blogId/posts', validateBlogId, inputPaginationValidator2(PostsSortListEnum), inputErrorManagementMiddleware, getSeveralPostsFromBlog);
blogsRouter.post('/:blogId/posts', superAdminGuardMiddleware, validateBlogId2, blogRoutesPostInputModelValidation, inputErrorManagementMiddleware, createNewBlogPost);

blogsRouter.get('/:id', validateBlogId3, inputErrorManagementMiddleware, findSingleBlog);
// inputErrorManagementMiddleware два раза или один? проверить!
blogsRouter.put('/:id', superAdminGuardMiddleware, validateBlogId3, /*inputErrorManagementMiddleware,*/ blogInputModelValidation, inputErrorManagementMiddleware, updateBlog); //auth guarded
blogsRouter.delete('/:id', superAdminGuardMiddleware, validateBlogId3, inputErrorManagementMiddleware, deleteBlog); //auth guarded



