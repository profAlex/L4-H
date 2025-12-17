import {Request, Response, Router} from 'express';
import {
    createNewBlog,
    deleteBlog,
    findSingleBlog,
    getSeveralBlogs, getSeveralPostsFromBlog,
    updateBlog
} from "./router handlers/blog-router-description";
import {blogInputModelValidation} from "../validation/BlogInputModel-validation-middleware";
import {inputErrorManagementMiddleware} from "../validation/error-management-validation-middleware";
import {superAdminGuardMiddleware} from "../validation/base64-auth-guard_middleware";
import {BlogsSortListEnum, PostsSortListEnum} from "./util-enums/fields-for-sorting";
import {inputPaginationValidator} from "./blogs-validation-middleware/blog-pagination-validator";
import {inputBlogIdValidation} from "../validation/blogid-input-validation-middleware";
import {postInputModelValidation} from "../validation/PostInputModel-validation-middleware";
import {createNewPost} from "./router handlers/post-router-description";
import {CollectionNames} from "../repository/collection-names";
import {
    inputBlogIdValidationVerification, inputBlogIdValidationVerification2, inputIdValidationVerification,

} from "../validation/id-verification-and-validation";
// import {inputIdValidationVerification} from "../validation/id-input-validation-middleware";

export const blogsRouter = Router();

export enum IdParamName {
    Id = 'id',
    BlogId = 'blogId',
}

blogsRouter.get('/', inputPaginationValidator(BlogsSortListEnum), inputErrorManagementMiddleware, getSeveralBlogs);
// где обрабатывать массив errorMessages (который в функции inputErrorManagementMiddleware), где его органично выводить если он не пустой?
blogsRouter.post('/', superAdminGuardMiddleware, blogInputModelValidation, inputErrorManagementMiddleware, createNewBlog); //auth guarded

blogsRouter.get('/:blogId/posts', inputBlogIdValidationVerification(CollectionNames.Blogs), inputPaginationValidator(PostsSortListEnum), inputErrorManagementMiddleware, getSeveralPostsFromBlog);
blogsRouter.post('/:blogId/posts', superAdminGuardMiddleware, inputBlogIdValidationVerification2(CollectionNames.Blogs), postInputModelValidation, inputErrorManagementMiddleware, createNewPost);

blogsRouter.get('/:id', inputIdValidationVerification(CollectionNames.Blogs), inputErrorManagementMiddleware, findSingleBlog);
// inputErrorManagementMiddleware два раза или один? проверить!
blogsRouter.put('/:id', superAdminGuardMiddleware, inputIdValidationVerification(CollectionNames.Blogs), /*inputErrorManagementMiddleware,*/ blogInputModelValidation, inputErrorManagementMiddleware, updateBlog); //auth guarded
blogsRouter.delete('/:id', superAdminGuardMiddleware, inputIdValidationVerification(CollectionNames.Blogs), inputErrorManagementMiddleware, deleteBlog); //auth guarded



