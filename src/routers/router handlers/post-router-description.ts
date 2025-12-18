import {Request, Response} from "express";
import {HttpStatus} from "../../core/http-statuses";
import {dataRepository} from "../../repository/blogger-mongodb-repository";
import {postsService} from "../../service/posts-service";


export const getAllPosts= async (req:Request, res:Response) => {
    res.status(HttpStatus.Ok).json(await postsService.getAllPosts());
};

export const createNewPost= async (req:Request, res:Response) => {
    const result = await postsService.createNewPost(req.body)

    // if(result === undefined)
    // {
    //     // res.sendStatus(HttpStatus.NotFound);
    //
    //     res.status(HttpStatus.Created).json({ errorsMessages: "this is what ive been trying to find" });
    //
    //     throw new Error(`couldn't create new post inside postsService.createNewPost`);
    // }

    res.status(HttpStatus.Created).json(result);
};

export const findSinglePost= async (req:Request, res:Response) => {
    const result = await postsService.findSinglePost(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.status(HttpStatus.Ok).json(result);
};

export const updatePost= async (req:Request, res:Response) => {
    const result = await postsService.updatePost(req.params.id, req.body);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};

export const deletePost = async (req:Request, res:Response) => {
    const result = await postsService.deletePost(req.params.id);

    if(result === undefined)
    {
        res.sendStatus(HttpStatus.NotFound);
    }

    res.sendStatus(HttpStatus.NoContent);
};