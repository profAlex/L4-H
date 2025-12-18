import {dataRepository, postCollectionStorageModel} from "../repository/blogger-mongodb-repository";
import {PostViewModel} from "../routers/router-types/post-view-model";
import {PostInputModel} from "../routers/router-types/post-input-model";

export const postsService = {

    async getAllPosts(): Promise <PostViewModel[] | []> {
        return await dataRepository.getAllPosts();
    },

    async createNewPost(newPost: PostInputModel): Promise<PostViewModel | undefined> {
        const result = await dataRepository.createNewPost(newPost);

        // if(result === undefined)
        // {
        //     // res.sendStatus(HttpStatus.NotFound);
        //     console.error("Error creating new post");
        //     throw new Error(`couldn't create new post inside dataRepository.createNewPost`);
        // }

        return result;
    },

    async findSinglePost(postId: string): Promise<PostViewModel | undefined> {
        return await dataRepository.findSinglePost(postId);
    },

    async updatePost(postId: string, newData: PostInputModel) {
        return await dataRepository.updatePost(postId, newData);
    },

    async deletePost (postId: string): Promise<null | undefined> {
        return await dataRepository.deletePost(postId);
    },
    }