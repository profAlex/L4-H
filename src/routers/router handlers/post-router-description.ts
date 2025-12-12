import {Request, Response} from "express";
import {HttpStatus} from "../../core/http-statuses";
import {dataRepository} from "../../repository/blogger-mongodb-repository";


export const getAllPosts= async (req:Request, res:Response) => {
    res.status(HttpStatus.Ok).json(await dataRepository.getAllPosts());
};

export const createNewPost= async (req:Request, res:Response) => {
    const result = await dataRepository.createNewPost(req.body)
    res.status(HttpStatus.Created).json(result);
};

export const findSinglePost= async (req:Request, res:Response) => {
    const result = await dataRepository.findSinglePost(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(result);
};

export const updatePost= async (req:Request, res:Response) => {
    const result = await dataRepository.updatePost(req.params.id, req.body);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};

export const deletePost = async (req:Request, res:Response) => {
    const result = await dataRepository.deletePost(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};