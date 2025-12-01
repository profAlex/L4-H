import {Request, Response} from "express";
import {HttpStatus} from "../../core/http-statuses";
import {dataRepository} from "../../repository/blogger-mongodb-repository";

export const getAllBlogs = async (req:Request, res:Response) => {
    res.status(HttpStatus.Ok).json(await dataRepository.getAllBlogs());
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