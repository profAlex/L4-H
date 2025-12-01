"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataRepository = void 0;
const mongo_db_1 = require("../db/mongo.db");
const mongodb_1 = require("mongodb");
//bloggerPosts: PostViewModel[] | null | undefined;
// const __nonDisclosableDatabase = {
//     bloggerRepository: [{
//         bloggerInfo:
//             {
//                 id: "001",
//                 name: "blogger_001",
//                 description: "takoy sebe blogger...",
//                 websiteUrl: "https://takoy.blogger.com",
//             },
//         bloggerPosts:
//             [{
//                 id: "001_001",
//                 title: "post blog 001",
//                 shortDescription: "post ni o 4em",
//                 content: "Eto testovoe napolnenie posta 001_001",
//                 blogId: "001",
//                 blogName: "blogger_001"
//             },
//             {
//                 id: "001_002",
//                 title: "post blog 002",
//                 shortDescription: "post ni o 4em",
//                 content: "Eto testovoe napolnenie posta 001_002",
//                 blogId: "001",
//                 blogName: "blogger_001"
//             }
//         ]},
//         {
//             bloggerInfo:
//             {
//                 id: "002",
//                 name: "blogger_002",
//                 description: "a eto klassnii blogger!",
//                 wbesiteUrl: "https://klassnii.blogger.com"
//             },
//             bloggerPosts:
//             [{
//                 id: "002_001",
//                 title: "post blog 001",
//                 shortDescription: "horowii post",
//                 content: "Eto testovoe napolnenie posta 002_001",
//                 blogId: "002",
//                 blogName: "blogger_002"
//             },
//             {
//                 postId: "002_002",
//                 postTitle: "post blog 002",
//                 postShortDescription: "horowii post",
//                 postContent: "Eto testovoe napolnenie posta 002_002",
//                 blogId: "002",
//                 blogName: "blogger_002"
//             }]
//         }
//     ]
// const bloggerInfo: bloggerCollectionStorageModel[] = [
//     {
//         id: "001",
//         name: "blogger_001",
//         description: "takoy sebe blogger...",
//         websiteUrl: "https://takoy.blogger.com",
//         createdAt: new Date,
//         isMembership: false
//     },
//     {
//         id: "002",
//         name: "blogger_002",
//         description: "a eto klassnii blogger!",
//         websiteUrl: "https://klassnii.blogger.com",
//         createdAt: new Date,
//         isMembership: false,
//     }
// ];
//
//
// const bloggerPosts: postCollectionStorageModel[] = [
//     {
//         id: "001_001",
//         title: "post blog 001",
//         shortDescription: "post ni o 4em",
//         content: "Eto testovoe napolnenie posta 001_001",
//         blogId: "001",
//         blogName: "blogger_001",
//         createdAt: new Date()
//     },
//     {
//         id: "001_002",
//         title: "post blog 002",
//         shortDescription: "post ni o 4em",
//         content: "Eto testovoe napolnenie posta 001_002",
//         blogId: "001",
//         blogName: "blogger_001",
//         createdAt: new Date()
//     },
//     {
//         id: "002_001",
//         title: "post blog 001",
//         shortDescription: "horowii post",
//         content: "Eto testovoe napolnenie posta 002_001",
//         blogId: "002",
//         blogName: "blogger_002",
//         createdAt: new Date()
//     },
//     {
//         id: "002_002",
//         title: "post blog 002",
//         shortDescription: "horowii post",
//         content: "Eto testovoe napolnenie posta 002_002",
//         blogId: "002",
//         blogName: "blogger_002",
//         createdAt: new Date()
//     }
// ];
// А есть ли какой-либо смысл это оставлять? Нужна ли нам генерация уникального ID если мы используем айдишник монгодиби?
const generateCombinedId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString().substring(2, 5);
    return `${timestamp}-${random}`;
};
const transformSingleBloggerCollectionToViewModel = (blogInContainer) => {
    return {
        id: blogInContainer._id.toString(),
        name: blogInContainer.name,
        description: blogInContainer.description,
        websiteUrl: blogInContainer.websiteUrl,
        createdAt: blogInContainer.createdAt,
        isMembership: false
    };
};
const transformSinglePostCollectionToViewModel = (postInContainer) => {
    return {
        id: postInContainer._id.toString(),
        title: postInContainer.title,
        shortDescription: postInContainer.shortDescription,
        content: postInContainer.content,
        blogId: postInContainer.blogId,
        blogName: postInContainer.blogName,
        createdAt: postInContainer.createdAt
    };
};
function findBlogByPrimaryKey(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_db_1.bloggersCollection.findOne({ _id: id });
    });
}
function findPostByPrimaryKey(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_db_1.postsCollection.findOne({ _id: id });
    });
}
exports.dataRepository = {
    // *****************************
    // методы для управления блогами
    // *****************************
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            // return __nonDisclosableDatabase.bloggerRepository.map(({ bloggerInfo }) => ({
            //     id: bloggerInfo.id,
            //     name: bloggerInfo.name,
            //     description: bloggerInfo.description,
            //     websiteUrl: bloggerInfo.websiteUrl
            // }));
            const tempContainer = yield mongo_db_1.bloggersCollection.find({}).toArray();
            return tempContainer.map((value) => ({
                id: value._id.toString(),
                name: value.name,
                description: value.description,
                websiteUrl: value.websiteUrl,
                createdAt: value.createdAt,
                isMembership: false
            }));
            // _id: ObjectId,
            // id: string;
            // name: string;
            // description: string;
            // websiteUrl: string;
            // createdAt: Date;
            // isMembership: boolean;
        });
    },
    createNewBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const tempId = new mongodb_1.ObjectId();
            const newBlogEntry = Object.assign(Object.assign({ _id: tempId, id: tempId.toString() }, newBlog), { createdAt: new Date(), isMembership: false });
            yield mongo_db_1.bloggersCollection.insertOne(newBlogEntry);
            // __nonDisclosableDatabase.bloggerRepository.push(newDatabaseEntry);
            // console.log("ID Inside repository: ",newBlogEntry.id);
            return transformSingleBloggerCollectionToViewModel(newBlogEntry);
        });
    },
    findSingleBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(blogId)) {
                const blogger = yield findBlogByPrimaryKey(new mongodb_1.ObjectId(blogId));
                if (blogger) {
                    // const foundBlogger = {
                    //     id: blogger.bloggerInfo.id,
                    //     name: blogger.bloggerInfo.name,
                    //     description: blogger.bloggerInfo.description,
                    //     websiteUrl: blogger.bloggerInfo.websiteUrl
                    // }
                    // console.log("ID inside finding function:", foundBlogger.id);
                    return transformSingleBloggerCollectionToViewModel(blogger);
                }
            }
            return undefined;
        });
    },
    updateBlog(blogId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(blogId)) {
                const idToCheck = new mongodb_1.ObjectId(blogId);
                const res = yield mongo_db_1.bloggersCollection.updateOne({ _id: idToCheck }, { $set: Object.assign({}, newData) });
                if (res.matchedCount === 1) {
                    return null;
                }
            }
            //
            // const blogger = __nonDisclosableDatabase.bloggerRepository.find((blogger) => blogger.bloggerInfo.id === blogId);
            //
            // if(blogger)
            // {
            //     let blogIndex = __nonDisclosableDatabase.bloggerRepository.indexOf(blogger);
            //
            //     const updatedBlogger = {
            //         ...blogger,
            //         bloggerInfo: {
            //             id: blogger.bloggerInfo.id,
            //             name: newData.name,
            //             description: newData.description,
            //             websiteUrl: newData.websiteUrl
            //         }
            //     }
            //
            //     __nonDisclosableDatabase.bloggerRepository[blogIndex] = updatedBlogger;
            //
            //     return null;
            // }
            return undefined;
        });
    },
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(blogId)) {
                const idToCheck = new mongodb_1.ObjectId(blogId);
                const res = yield mongo_db_1.bloggersCollection.deleteOne({ _id: idToCheck });
                if (res.deletedCount === 1) {
                    return null;
                }
            }
            return undefined;
            // const blogger = __nonDisclosableDatabase.bloggerRepository.find((blogger) => blogger.bloggerInfo.id === blogId);
            // if(blogger)
            // {
            //     let blogIndex = __nonDisclosableDatabase.bloggerRepository.indexOf(blogger);
            //     __nonDisclosableDatabase.bloggerRepository.splice(blogIndex, 1);
            //
            //     return null;
            // }
            //
            // return undefined;
        });
    },
    // *****************************
    // методы для управления постами
    // *****************************
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            // return __nonDisclosableDatabase.bloggerRepository.flatMap((element: bloggerRawData):PostViewModel[] | [] => (element.bloggerPosts ?? []));
            const tempContainer = yield mongo_db_1.postsCollection.find({}).toArray();
            // console.log('LOOK HERE ---->', tempContainer.length);
            return tempContainer.map((value) => ({
                id: value._id.toString(),
                title: value.title,
                shortDescription: value.shortDescription,
                content: value.content,
                blogId: value.blogId,
                blogName: value.blogName,
                createdAt: value.createdAt
            }));
            // _id: ObjectId,
            // id: string;
            // title: string;
            // shortDescription: string;
            // content: string;
            // blogId: string;
            // blogName: string;
            // createdAt: Date;
        });
    },
    createNewPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(newPost.blogId)) {
                const tempId = new mongodb_1.ObjectId();
                const relatedBlogger = yield this.findSingleBlog(newPost.blogId);
                if (relatedBlogger) {
                    const newPostEntry = Object.assign(Object.assign({ _id: tempId, id: tempId.toString() }, newPost), { 
                        //blogId: newPost.blogId,
                        blogName: relatedBlogger.name, createdAt: new Date() });
                    // const test = transformSinglePostCollectionToViewModel(newPostEntry);
                    //
                    // if(test.title === "post blog 003") //== "Eto OBNOVLENNOE testovoe napolnenie posta 001_003"
                    // {
                    //     const propertyCount = Object.keys(test).length;
                    //     console.log("LOOK HERE ------>", propertyCount);
                    // }
                    yield mongo_db_1.postsCollection.insertOne(newPostEntry);
                    //const propertyCount = Object.keys(newPostEntry).length;
                    //console.log("LOOK HERE ------>", propertyCount);
                    return transformSinglePostCollectionToViewModel(newPostEntry);
                    // return test;
                }
            }
            return undefined;
            // let blogName = this.findSingleBlog(newPost.blogId)?.name;
            // if (!blogName)
            // {
            //     return undefined;
            // }
            //
            // const blogIndex = __nonDisclosableDatabase.bloggerRepository.findIndex(
            //     (blogger) => blogger.bloggerInfo.id === newPost.blogId
            // );
            //
            // const newPostEntry = {
            //     ...newPost,
            //     id: generateCombinedId(),
            //     blogName: blogName,
            // };
            //
            // __nonDisclosableDatabase.bloggerRepository[blogIndex].bloggerPosts?.push(newPostEntry);
            //
            // return newPostEntry;
        });
    },
    findSinglePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(postId)) {
                //А если ключ существует надо ли делат проверку ша if(post) ?
                const post = yield findPostByPrimaryKey(new mongodb_1.ObjectId(postId));
                if (post) {
                    return transformSinglePostCollectionToViewModel(post);
                }
            }
            return undefined;
            // for (const blogger of __nonDisclosableDatabase.bloggerRepository) {
            //     if (!blogger.bloggerPosts) continue;
            //     for(const post of blogger.bloggerPosts)
            //     {
            //         if(post.id === postId)
            //             return post;
            //     }
            // }
            // return undefined;
        });
    },
    updatePost(postId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            // const blogger = __nonDisclosableDatabase.bloggerRepository.find((blogger) => blogger.bloggerInfo.id === newData.blogId);
            //
            // if(blogger && blogger.bloggerPosts)
            // {
            //     let blogIndex = __nonDisclosableDatabase.bloggerRepository.indexOf(blogger);
            //     let post = this.findSinglePost(postId);
            //
            //     if(blogIndex !== -1 && post) {
            //         let postIndex = blogger.bloggerPosts.indexOf(post);
            //
            //         if(postIndex !== -1)
            //         {
            //             const updatedPost: PostViewModel = {
            //                 id: post.id,
            //                 blogName: post.blogName,
            //                 ...newData
            //             };
            //
            //             // Создаем новый массив постов с обновленным постом
            //             const updatedPosts = [
            //                 ...blogger.bloggerPosts.slice(0, postIndex),
            //                 updatedPost,
            //                 ...blogger.bloggerPosts.slice(postIndex + 1)
            //             ];
            //
            //             // Создаем обновленную запись блоггера
            //             const updatedBlogEntry: bloggerRawData = {
            //                 ...blogger,
            //                 bloggerPosts: updatedPosts
            //             };
            //
            //
            //                 __nonDisclosableDatabase.bloggerRepository[blogIndex] = updatedBlogEntry;
            //             return null;
            //         }
            //     }
            // }
            if (mongodb_1.ObjectId.isValid(postId)) {
                const idToCheck = new mongodb_1.ObjectId(postId);
                const res = yield mongo_db_1.postsCollection.updateOne({ _id: idToCheck }, { $set: Object.assign({}, newData) });
                if (res.matchedCount === 1) {
                    return null;
                }
            }
            return undefined;
        });
    },
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongodb_1.ObjectId.isValid(postId)) {
                const idToCheck = new mongodb_1.ObjectId(postId);
                const res = yield mongo_db_1.postsCollection.deleteOne({ _id: idToCheck });
                if (res.deletedCount === 1) {
                    return null;
                }
            }
            return undefined;
            // const post = this.findSinglePost(postId);
            // if(!post)
            // {
            //     return undefined;
            // }
            //
            // const blogIdFromPost = post.blogId;
            // const blogger = __nonDisclosableDatabase.bloggerRepository.find((blogger) => blogger.bloggerInfo.id === blogIdFromPost);
            //
            // if(blogger && blogger.bloggerPosts)
            // {
            //     let blogIndex = __nonDisclosableDatabase.bloggerRepository.indexOf(blogger);
            //
            //     if(blogIndex !== -1 && post) {
            //         let postIndex = blogger.bloggerPosts.indexOf(post);
            //         __nonDisclosableDatabase.bloggerRepository[blogIndex].bloggerPosts?.splice(postIndex,1);
            //
            //         return null;
            //     }
            // }
            //
            // return undefined;
        });
    },
    // *****************************
    // методы для тестов
    // *****************************
    deleteAllBloggers() {
        return __awaiter(this, void 0, void 0, function* () {
            yield mongo_db_1.bloggersCollection.deleteMany({});
            yield mongo_db_1.postsCollection.deleteMany({});
        });
    },
    returnBloggersAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.bloggersCollection.countDocuments();
        });
    }
};
