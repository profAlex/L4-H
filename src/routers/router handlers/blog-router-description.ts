import {Request, Response} from "express";
import {HttpStatus} from "../../core/http-statuses";
import {dataRepository} from "../../repository/blogger-mongodb-repository";
import {blogsService} from "../../service/blogs-service";
import {InputGetBlogsQuery} from "../router-types/blog-search-input-model";
import {matchedData} from "express-validator";
import {PaginatedBlogViewModel} from "../router-types/blog-paginated-view-model";

export const getSeveralBlogs = async (req: Request<{}, {}, {}, InputGetBlogsQuery>, res: Response) => {

    const sanitizedQuery = matchedData<InputGetBlogsQuery>(req, {
        locations: ['query'],
        includeOptionals: true,
    }); //утилита для извечения трансформированных значений после валидатара
    //в req.query остаются сырые квери параметры (строки)

    const results: PaginatedBlogViewModel = await blogsService.getSeveralBlogs(sanitizedQuery);

    const driversListOutput = mapToDriverListPaginatedOutput(items, {
        pageNumber: sanitizedQuery.pageNumber,
        pageSize: sanitizedQuery.pageSize,
        totalCount,
    });

    res.status(HttpStatus.Ok).send(driversListOutput);
};

export const createNewBlog = async (req: Request, res: Response) => {
    res.status(HttpStatus.Created).json(await dataRepository.createNewBlog(req.body));
};

export const findSingleBlog = async (req: Request, res: Response) => {
    const result = await dataRepository.findSingleBlog(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(result);
};

export const updateBlog = async (req: Request, res: Response) => {
    const result = await dataRepository.updateBlog(req.params.id, req.body);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};

export const deleteBlog = async (req: Request, res: Response) => {
    const result = await dataRepository.deleteBlog(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};