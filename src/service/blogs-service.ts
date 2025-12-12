import {CustomSortDirection} from "../routers/util-enums/sort-direction";
import {Request, Response} from "express";



export const blogsService = {
    async getSeveralBlogs() {

        res.status(HttpStatus.Ok).json(await dataRepository.getAllBlogs());
    }
}