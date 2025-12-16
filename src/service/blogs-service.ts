import {CustomSortDirection} from "../routers/util-enums/sort-direction";
import {Request, Response} from "express";
import {InputGetBlogsQuery} from "../routers/router-types/blog-search-input-model";
import {WithId} from "mongodb";
import {BlogViewModel} from "../routers/router-types/blog-view-model";
import {dataRepository} from "../repository/blogger-mongodb-repository";
import {InputGetBlogPostsByIdQuery} from "../routers/router-types/blog-search-by-id-input-model";
import {PostViewModel} from "../routers/router-types/post-view-model";
import {BlogInputModel} from "../routers/router-types/blog-input-model";



export const blogsService = {
    async getSeveralBlogs(sentInputGetDriverQuery: InputGetBlogsQuery): Promise<{items: WithId<BlogViewModel>[]; totalCount: number}> {

        return await dataRepository.getSeveralBlogs(sentInputGetDriverQuery);
    },

    async createNewBlog(newBlog: BlogInputModel) {

        return await dataRepository.createNewBlog(newBlog);
    },

    async getAllPostsFromBlog(sentBlogId:string, sent: InputGetBlogPostsByIdQuery): Promise<{items: WithId<PostViewModel>[]; totalCount: number}> {

        return await dataRepository.getSeveralPosts(sentBlogId, sent);
    },
}