import {dataRepository, postCollectionStorageModel} from "../repository/blogger-mongodb-repository";
import {PostViewModel} from "../routers/router-types/post-view-model";
import {PostInputModel} from "../routers/router-types/post-input-model";

export const postsService = {

    async getAllPosts(): Promise <PostViewModel[] | []> {
        return await dataRepository.getAllPosts();
    },

    async createNewPost(newPost: PostInputModel): Promise<PostViewModel | undefined> {
        return await dataRepository.createNewPost(newPost);
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