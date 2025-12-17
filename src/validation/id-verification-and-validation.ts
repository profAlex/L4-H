import {Request, Response, NextFunction, json} from "express";
import {ObjectId} from "mongodb";
import {HttpStatus} from "../core/http-statuses";
import {db, postsCollection, bloggersCollection} from "../db/mongo.db";
import {InputGetBlogPostsByIdQuery} from "../routers/router-types/blog-search-by-id-input-model";


type IdParams = {
    blogId?: string;
    id?: string;
};

export function inputBlogIdValidationVerification(collectionName: string) {
    return async  (req: Request<{blogId: string}, {}, {}, InputGetBlogPostsByIdQuery>, res: Response, next: NextFunction) => {
        const sentId = req.params.blogId;

        console.log("<------------ HVE WE GOT THERE? 1", sentId);

        if (!sentId) {
            res.status(HttpStatus.BadRequest).json({
                error: 'ID parameter (blogId or id) is required'
            });
            return;
        }

        console.log("<------------ HVE WE GOT THERE? 2", sentId);

        if(!ObjectId.isValid(sentId)) {
            res.status(HttpStatus.BadRequest).json({error: `Sent ID: ${sentId} is invalid, empty or undefined`});
            return;
        }

        console.log("<------------ HVE WE GOT THERE? 3", sentId);

        try{
            const results = await db.collection(collectionName).findOne({_id: new ObjectId(sentId)}, {projection: {_id: 1}});

            console.log("<------------ HVE WE GOT THERE? 4", results);

            if(!results)
            {
                res.status(HttpStatus.NotFound).json({error: `ID ${sentId} doesn't exist`});
                return;
            }

            next();
        }
        catch(err){
            res.status(HttpStatus.InternalServerError).json({error: 'Internal server error while validating ID'});
        }
    }
}


export function inputBlogIdValidationVerification2(collectionName: string) {
    return async  (req: Request, res: Response, next: NextFunction) => {
        const sentId = req.params.blogId;

        if (!sentId) {
            res.status(HttpStatus.BadRequest).json({
                error: 'ID parameter (blogId or id) is required'
            });
            return;
        }

        if(!ObjectId.isValid(sentId)) {
            res.status(HttpStatus.BadRequest).json({error: `Sent ID: ${sentId} is invalid, empty or undefined`});
            return;
        }

        try{
            const results = await db.collection(collectionName).findOne({_id: new ObjectId(sentId)}, {projection: {_id: 1}});

            if(!results)
            {
                res.status(HttpStatus.NotFound).json({error: `ID ${sentId} doesn't exist`});
                return;
            }

            next();
        }
        catch(err){
            res.status(HttpStatus.InternalServerError).json({error: 'Internal server error while validating ID'});
        }
    }
}


export function inputIdValidationVerification(collectionName: string) {
    return async  (req: Request, res: Response, next: NextFunction) => {
        const sentId = req.params.id;

        if (!sentId) {
            res.status(HttpStatus.BadRequest).json({
                error: 'ID parameter (blogId or id) is required'
            });
            return;
        }

        if(!ObjectId.isValid(sentId)) {
            res.status(HttpStatus.BadRequest).json({error: `Sent ID: ${sentId} is invalid, empty or undefined`});
            return;
        }

        try{
            const results = await db.collection(collectionName).findOne({_id: new ObjectId(sentId)}, {projection: {_id: 1}});

            if(!results)
            {
                res.status(HttpStatus.NotFound).json({error: `ID ${sentId} doesn't exist`});
                return;
            }

            next();
        }
        catch(err){
            res.status(HttpStatus.InternalServerError).json({error: 'Internal server error while validating ID'});
        }
    }
}