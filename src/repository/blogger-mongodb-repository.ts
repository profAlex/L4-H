import {BlogViewModel} from "../routers/router-types/blog-view-model";
import {BlogInputModel} from "../routers/router-types/blog-input-model";
import {PostViewModel} from "../routers/router-types/post-view-model";
import {PostInputModel} from "../routers/router-types/post-input-model";
import {bloggersCollection, postsCollection} from "../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {InputGetBlogsQuery} from "../routers/router-types/blog-search-input-model";
import {InputGetBlogPostsByIdQuery} from "../routers/router-types/blog-search-by-id-input-model";

// type blogPost = {
//     postId: string;
//     postTitle: string;
//     postShortDescription: string;
//     postContent: string;
// };

export type bloggerCollectionStorageModel= {
    _id: ObjectId,
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;
};

export type postCollectionStorageModel = {
    _id: ObjectId,
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

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
    const random = Math.random().toString().substring(2,5);
    return `${timestamp}-${random}`;
};

const transformSingleBloggerCollectionToViewModel = (blogInContainer: bloggerCollectionStorageModel) => {
    return {
        id: blogInContainer._id.toString(),
        name: blogInContainer.name,
        description: blogInContainer.description,
        websiteUrl: blogInContainer.websiteUrl,
        createdAt: blogInContainer.createdAt,
        isMembership: false
    } as BlogViewModel;
};

const transformSinglePostCollectionToViewModel = (postInContainer: postCollectionStorageModel) => {
    return {
        id: postInContainer._id.toString(),
        title: postInContainer.title,
        shortDescription: postInContainer.shortDescription,
        content: postInContainer.content,
        blogId: postInContainer.blogId,
        blogName: postInContainer.blogName,
        createdAt: postInContainer.createdAt
    } as PostViewModel;
};

async function findBlogByPrimaryKey(id: ObjectId): Promise<bloggerCollectionStorageModel | null> {
    return bloggersCollection.findOne({ _id: id });
}

async function findPostByPrimaryKey(id: ObjectId): Promise<postCollectionStorageModel | null> {
    return postsCollection.findOne({ _id: id });
}

export const dataRepository = {

    // *****************************
    // методы для управления блогами
    // *****************************
    async getSeveralBlogs(sentInputGetDriverQuery: InputGetBlogsQuery) : Promise<{items: WithId<BlogViewModel>[]; totalCount: number}> {
        // return __nonDisclosableDatabase.bloggerRepository.map(({ bloggerInfo }) => ({
        //     id: bloggerInfo.id,
        //     name: bloggerInfo.name,
        //     description: bloggerInfo.description,
        //     websiteUrl: bloggerInfo.websiteUrl
        // }));

        let tempDto;
        const {
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
        } = sentInputGetDriverQuery;

        const filter :any = {};
        const skip = (pageNumber - 1) * pageSize;

        // const tempContainer: bloggerCollectionStorageModel[]  = await bloggersCollection.find({}).toArray();
        //
        // return tempContainer.map((value: bloggerCollectionStorageModel) => ({
        //     id: value._id.toString(),
        //     name: value.name,
        //     description: value.description,
        //     websiteUrl: value.websiteUrl,
        //     createdAt: value.createdAt,
        //     isMembership: false
        // }));

        // _id: ObjectId,
        // id: string;
        // name: string;
        // description: string;
        // websiteUrl: string;
        // createdAt: Date;
        // isMembership: boolean;

        if(searchNameTerm)
        {
            filter.push({ name: { $regex: searchNameTerm, $options: 'i' } });
        }

        if(!sortBy) {
            throw new Error();
        }

        const items = await bloggersCollection
            .find(filter)

            // "asc" (по возрастанию), то используется 1
            // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
            .sort({[sortBy]: sortDirection})

            // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
            .skip(skip)

            // ограничивает количество возвращаемых документов до значения pageSize
            .limit(pageSize)
            .toArray();

        const totalCount = await bloggersCollection.countDocuments(filter);

        return {items, totalCount};
    },


    async createNewBlog(newBlog: BlogInputModel): Promise <BlogViewModel> {
        const tempId = new ObjectId();
        const newBlogEntry = {
            _id: tempId,
            id: tempId.toString(),
            ...newBlog,
            createdAt: new Date(),
            isMembership: false
        } as bloggerCollectionStorageModel;

        await bloggersCollection.insertOne(newBlogEntry);

        // __nonDisclosableDatabase.bloggerRepository.push(newDatabaseEntry);

        // console.log("ID Inside repository: ",newBlogEntry.id);
        return transformSingleBloggerCollectionToViewModel(newBlogEntry);
    },

    async getSeveralPosts(sentBlogId:string, sent: InputGetBlogPostsByIdQuery) : Promise<{items: WithId<PostViewModel>[]; totalCount: number}> {
        let tempDto;
        const {
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
        } = sent;

        const filter :any = {};
        const skip = (pageNumber - 1) * pageSize;

        if(!sortBy) {
            throw new Error();
        }

        const items = await postsCollection
            .find({id: sentBlogId})

            // "asc" (по возрастанию), то используется 1
            // "desc" — то -1 для сортировки по убыванию. - по алфавиту от Я-А, Z-A
            .sort({[sortBy]: sortDirection})

            // пропускаем определённое количество док. перед тем, как вернуть нужный набор данных.
            .skip(skip)

            // ограничивает количество возвращаемых документов до значения pageSize
            .limit(pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments({id: sentBlogId});

        return {items, totalCount};
    },

    async findSingleBlog(blogId: string): Promise<BlogViewModel | undefined> {

        if (ObjectId.isValid(blogId)) {

            const blogger: bloggerCollectionStorageModel | null = await findBlogByPrimaryKey(new ObjectId(blogId));

            if(blogger)
            {
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
    },


    async updateBlog(blogId: string, newData: BlogInputModel): Promise<null | undefined> {

        if (ObjectId.isValid(blogId)) {

            const idToCheck = new ObjectId(blogId);
            const res = await bloggersCollection.updateOne(
                {_id: idToCheck},
                {$set: {...newData}}
            );

            if(res.matchedCount === 1)
            {
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
    },


    async deleteBlog(blogId: string): Promise<null | undefined> {

        if (ObjectId.isValid(blogId)) {
            const idToCheck = new ObjectId(blogId);
            const res = await bloggersCollection.deleteOne({_id: idToCheck});

            if(res.deletedCount === 1)
            {
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
    },

    // *****************************
    // методы для управления постами
    // *****************************
    async getAllPosts(): Promise <PostViewModel[] | []> {
        // return __nonDisclosableDatabase.bloggerRepository.flatMap((element: bloggerRawData):PostViewModel[] | [] => (element.bloggerPosts ?? []));

        const tempContainer: postCollectionStorageModel[] | []  = await postsCollection.find({}).toArray();

        // console.log('LOOK HERE ---->', tempContainer.length);

        return tempContainer.map((value: postCollectionStorageModel) => ({
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
    },


    async createNewPost(newPost: PostInputModel): Promise<PostViewModel | undefined> {

        if (ObjectId.isValid(newPost.blogId))
        {
            const tempId = new ObjectId();
            const relatedBlogger = await this.findSingleBlog(newPost.blogId);

            if (relatedBlogger){
                const newPostEntry = {
                    _id: tempId,
                    id: tempId.toString(),
                    ...newPost,
                    //blogId: newPost.blogId,
                    blogName: relatedBlogger.name,
                    createdAt: new Date()
                } as postCollectionStorageModel;

                // const test = transformSinglePostCollectionToViewModel(newPostEntry);
                //
                // if(test.title === "post blog 003") //== "Eto OBNOVLENNOE testovoe napolnenie posta 001_003"
                // {
                //     const propertyCount = Object.keys(test).length;
                //     console.log("LOOK HERE ------>", propertyCount);
                // }

                await postsCollection.insertOne(newPostEntry);

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
    },

    async findSinglePost(postId: string): Promise<PostViewModel | undefined> {
        if (ObjectId.isValid(postId)) {

            //А если ключ существует надо ли делат проверку ша if(post) ?
            const post: postCollectionStorageModel | null = await findPostByPrimaryKey(new ObjectId(postId));

            if(post)
            {
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
    },

    async updatePost(postId: string, newData: PostInputModel): Promise<null | undefined> {

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


        if (ObjectId.isValid(postId)) {

            const idToCheck = new ObjectId(postId);
            const res = await postsCollection.updateOne(
                {_id: idToCheck},
                {$set: {...newData}}
            );

            if(res.matchedCount === 1)
            {
                return null;
            }
        }
        return undefined;
    },

    async deletePost(postId: string): Promise<null | undefined> {

        if (ObjectId.isValid(postId)) {
            const idToCheck = new ObjectId(postId);
            const res = await postsCollection.deleteOne({_id: idToCheck});

            if(res.deletedCount === 1)
            {
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
    },

    // *****************************
    // методы для тестов
    // *****************************
    async deleteAllBloggers() {
        await bloggersCollection.deleteMany({});
        await postsCollection.deleteMany({});
    },

    async returnBloggersAmount() {
        return await bloggersCollection.countDocuments();
    }
}