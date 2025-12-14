import {CustomSortDirection} from "../routers/util-enums/sort-direction";
import {Request, Response} from "express";
import {InputGetBlogsQuery} from "../routers/router-types/blog-search-input-model";
import {WithId} from "mongodb";
import {BlogViewModel} from "../routers/router-types/blog-view-model";
import {dataRepository} from "../repository/blogger-mongodb-repository";



export const blogsService = {
    async getSeveralBlogs(sentInputGetDriverQuery: InputGetBlogsQuery) : Promise<{items: WithId<BlogViewModel>[]; totalCount: number}> {

        return await dataRepository.getSeveralBlogs(sentInputGetDriverQuery);
    }
}