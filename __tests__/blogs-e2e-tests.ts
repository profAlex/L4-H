import request from 'supertest';
import { Response } from 'supertest';
import express from "express";
import {setupApp} from "../src/setup-app";
import {BlogInputModel} from "../src/routers/router-types/blog-input-model";
import {BLOGS_PATH, TESTING_PATH} from "../src/routers/router-pathes";
import {bloggerCollectionStorageModel, dataRepository} from "../src/repository/blogger-mongodb-repository";
import {HttpStatus} from "../src/core/http-statuses";
import {bloggersCollection, closeDB, postsCollection, runDB} from "../src/db/mongo.db";
import {ObjectId} from "mongodb";
import {PostInputModel} from "../src/routers/router-types/post-input-model";

describe("Test API for managing blogs(bloggers)", () =>{

    const testApp = express();
    setupApp(testApp);

    const correctBlogInput: BlogInputModel = {
        name: "MI OBRECHENI",
        description: "norm takoy blog",
        websiteUrl: "https://mi-obrecheni.herokuapp.com/",
    };

    beforeAll(async () => {
        await runDB();

        // Почему тут это не нужно?
        // testApp.listen(3003, () => {
        //     console.log(`Server started on port 3003`);
        // });

        const res = await request(testApp).delete(`${TESTING_PATH}/all-data`);
        expect(res.status).toBe(204);
    });

    afterAll(async () => {
        // Закрываем после всех тестов
        await closeDB();
    });

    let blogId_1:string = '';
    let blogId_2:string = '';

    it("Creating test base entries, directly without endpoint calls", async () => {

        const newBlog_1: BlogInputModel = {
            name: "blogger_001",
            description: "takoy sebe blogger...",
            websiteUrl: "https://takoy.blogger.com",
        }
        const insertedBlog_1 = await dataRepository.createNewBlog(newBlog_1);
        blogId_1 = insertedBlog_1.id;

        const newPost_1: PostInputModel = {
            title: "post blog 001",
            shortDescription: "post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_001",
            blogId: blogId_1,
        }
        await dataRepository.createNewPost(newPost_1);

        const newPost_2 =    {
            title: "post blog 002",
            shortDescription: "post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_002",
            blogId: blogId_1,
        }
        await dataRepository.createNewPost(newPost_2);

        const newBlog_2: BlogInputModel = {
            name: "blogger_002",
            description: "a eto klassnii blogger!",
            websiteUrl: "https://klassnii.blogger.com",
        }
        const insertedBlog_2 = await dataRepository.createNewBlog(newBlog_2);
        blogId_2 = insertedBlog_2.id;

        const newPost_3: PostInputModel = {
            title: "post blog 001",
            shortDescription: "horowii post",
            content: "Eto testovoe napolnenie posta 002_001",
            blogId: blogId_2,
        }
        await dataRepository.createNewPost(newPost_3);

        const newPost_4: PostInputModel = {
            title: "post blog 002",
            shortDescription: "horowii post",
            content: "Eto testovoe napolnenie posta 002_002",
            blogId: blogId_2,
        }
        await dataRepository.createNewPost(newPost_4);
    });

    it("GET '/api/blogs/' - should respond with a list of bloggers (total 2 entries in items object)", async() => {
        const res = await request(testApp).get(`${BLOGS_PATH}/`);

        const entriesCount = Object.values(res.body.items).length;

        // {
        //     "pagesCount" : 1,
        //     "page" : 1,
        //     "pageSize" : 10,
        //     "totalCount" : 2,
        //
        //     "items" : [ {
        //         "id" : "69426b01954a8971c2fa4ca7",
        //         "name" : "blogger_002",
        //         "description" : "a eto klassnii blogger!",
        //         "websiteUrl" : "https://klassnii.blogger.com",
        //         "createdAt" : "2025-12-17T08:34:09.999Z",
        //         "isMembership" : false
        //     }, {
        //         "id" : "69426b01954a8971c2fa4ca4",
        //         "name" : "blogger_001",
        //         "description" : "takoy sebe blogger...",
        //         "websiteUrl" : "https://takoy.blogger.com",
        //         "createdAt" : "2025-12-17T08:34:09.570Z",
        //         "isMembership" : false
        //     } ]
        // }

        expect(entriesCount).toBe(2);

        expect(res.status).toBe(HttpStatus.Ok);
    });


    it("GET '/blogs/blogId/posts - Returns all posts for specified blog - 2 total", async() => {
        // const resTemp = await request(testApp).get(`${BLOGS_PATH}/`);
        // // {
        // //     "pagesCount" : 1,
        // //     "page" : 1,
        // //     "pageSize" : 10,
        // //     "totalCount" : 2,
        // //     "items" : [ {
        // //         "id" : "69429c9a6fa871ce4ef2308c",
        // //         "name" : "blogger_002",
        // //         "description" : "a eto klassnii blogger!",
        // //         "websiteUrl" : "https://klassnii.blogger.com",
        // //         "createdAt" : "2025-12-17T12:05:46.324Z",
        // //         "isMembership" : false
        // //     }, {
        // //         "id" : "69429c996fa871ce4ef23089",
        // //         "name" : "blogger_001",
        // //         "description" : "takoy sebe blogger...",
        // //         "websiteUrl" : "https://takoy.blogger.com",
        // //         "createdAt" : "2025-12-17T12:05:45.756Z",
        // //         "isMembership" : false
        // //     } ]
        // // }

        const res: Response = await request(testApp).get(`${BLOGS_PATH}/${blogId_1}/posts/`);
        const entriesCount = Object.values(res.body.items).length;

        // {
        //     "pagesCount" : 1,
        //     "page" : 1,
        //     "pageSize" : 10,
        //     "totalCount" : 2,
        //     "items" : [ {
        //         "id" : "69429c9a6fa871ce4ef2308b",
        //         "title" : "post blog 002",
        //         "shortDescription" : "post ni o 4em",
        //         "content" : "Eto testovoe napolnenie posta 001_002",
        //         "blogId" : "69429c996fa871ce4ef23089",
        //         "blogName" : "blogger_001",
        //         "createdAt" : "2025-12-17T12:05:46.225Z"
        //     }, {
        //         "id" : "69429c996fa871ce4ef2308a",
        //         "title" : "post blog 001",
        //         "shortDescription" : "post ni o 4em",
        //         "content" : "Eto testovoe napolnenie posta 001_001",
        //         "blogId" : "69429c996fa871ce4ef23089",
        //         "blogName" : "blogger_001",
        //         "createdAt" : "2025-12-17T12:05:46.037Z"
        //     } ]
        // }

        expect(entriesCount).toBe(2);
        expect(res.status).toBe(HttpStatus.Ok);
        // console.log();
    });

    it("POST '/api/blogs/' - should add a blog to the repository", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(2);

        const res = await request(testApp).post(`${BLOGS_PATH}/`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5').send(correctBlogInput);
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        // console.log(res.body);
        const propertyCount = Object.keys(res.body).length;
        expect(propertyCount).toBe(6);

        expect(res.body.id).toBeDefined();
        expect(typeof res.body.id).toBe('string');
        expect(res.body).toHaveProperty('name', 'MI OBRECHENI');
        expect(res.body).toHaveProperty('description', 'norm takoy blog');
        expect(res.body).toHaveProperty('websiteUrl', 'https://mi-obrecheni.herokuapp.com/');
        expect(res.body).toHaveProperty('createdAt');
        expect(res.body).toHaveProperty('isMembership', false);

        expect(res.status).toBe(HttpStatus.Created);
    });

    it("POST '/api/blogs/' - shouldn't be able to add a blog to the repository with wrong login/password", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const res = await request(testApp).post(`${BLOGS_PATH}/`).set('Authorization', 'Basic ' + '111111').send(correctBlogInput);
        expect(res.status).toBe(HttpStatus.Unauthorized);

        const anotherRes = await request(testApp).post(`${BLOGS_PATH}/`).set('Authorization', '111111 ' + 'YWRtaW46cXdlcnR5').send(correctBlogInput);
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
    });

    it("GET '/api/blogs/{id}' - should respond with a BlogViewModel-formatted info about a requested blog", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const res = await request(testApp).get(`${BLOGS_PATH}/${blogId_1}`);

        const propertyCount = Object.keys(res.body).length;
        expect(propertyCount).toBe(6);

        expect(res.body).toHaveProperty('id', blogId_1);
        expect(res.body).toHaveProperty('name', 'blogger_001');
        expect(res.body).toHaveProperty('description', 'takoy sebe blogger...');
        expect(res.body).toHaveProperty('websiteUrl', 'https://takoy.blogger.com');

        expect(res.status).toBe(HttpStatus.Ok);
    });

    it("GET '/api/blogs/{id}' - shouldn't be able to find anything because of non-existing id and return proper return-code", async() => {
        const res = await request(testApp).get(`${BLOGS_PATH}/aaaaa`);
        expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("PUT '/api/blogs/{id}' - should correctly update a blog", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const updatedBlogInput: BlogInputModel = {
            name: "updated name",
            description: "updated description",
            websiteUrl: "https://takoy.blogger.com"
        };

        const res = await request(testApp).put(`${BLOGS_PATH}/${blogId_1}`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5').send(updatedBlogInput);
        expect(await dataRepository.returnBloggersAmount()).toBe(3);
        expect(res.status).toBe(HttpStatus.NoContent);

        const anotherResults = await request(testApp).get(`${BLOGS_PATH}/${blogId_1}`);
        expect(anotherResults.status).toBe(HttpStatus.Ok);
        expect(anotherResults).toBeDefined();
        expect(anotherResults.body).toHaveProperty('id', blogId_1);
        expect(anotherResults.body).toHaveProperty('name', 'updated name');
        expect(anotherResults.body).toHaveProperty('description', 'updated description');
        expect(anotherResults.body).toHaveProperty('websiteUrl', 'https://takoy.blogger.com');
    });

    it("PUT '/api/blogs/{id}' - should give a proper error message to a non-existing id", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const updatedBlogInput: BlogInputModel = {
            name: "updated name",
            description: "updated description",
            websiteUrl: "https://takoy.blogger.com"
        };

        const res = await request(testApp).put(`${BLOGS_PATH}/0000`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5').send(updatedBlogInput);
        expect(res.status).toBe(HttpStatus.BadRequest);

        //console.log("test");
    });

    it("PUT '/api/blogs/{id}' - should give a proper error message to an incorrect login/password pair", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const updatedBlogInput: BlogInputModel = {
            name: "updated name",
            description: "updated description",
            websiteUrl: "https://takoy.blogger.com"
        };

        const res = await request(testApp).put(`${BLOGS_PATH}/001`).set('Authorization', 'Basic ' + '1111111').send(updatedBlogInput);
        expect(res.status).toBe(HttpStatus.Unauthorized);

        const anotherRes = await request(testApp).put(`${BLOGS_PATH}/001`).set('Authorization', '1111111 ' + 'YWRtaW46cXdlcnR5').send(updatedBlogInput);
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
    });

    it("DELETE '/api/blogs/{id}' - shouldn't be able to delete a blog because of incorrect login/password pair", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const res = await request(testApp).delete(`${BLOGS_PATH}/001`).set('Authorization', 'Basic ' + '1111111');
        expect(res.status).toBe(HttpStatus.Unauthorized);
        expect(await dataRepository.returnBloggersAmount()).toBe(3);


        const anotherRes = await request(testApp).delete(`${BLOGS_PATH}/001`).set('Authorization', '1111111 ' + 'YWRtaW46cXdlcnR5');
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
        expect(await dataRepository.returnBloggersAmount()).toBe(3);
    });

    it("DELETE '/api/blogs/{id}' - should delete a blog", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(3);

        const res = await request(testApp).delete(`${BLOGS_PATH}/${blogId_1}`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5');
        expect(await dataRepository.returnBloggersAmount()).toBe(2);
    });

    it("DELETE '/api/blogs/{id}' - shouldn't be able to find non-existent blog entry, should give a proper return-code", async() => {
        expect(await dataRepository.returnBloggersAmount()).toBe(2);

        const anotherResults = await request(testApp).get(`${BLOGS_PATH}/${blogId_1}`);
        expect(anotherResults.status).toBe(HttpStatus.NotFound);
    });

    it("", async () => {
        const res = await request(testApp).delete(`${TESTING_PATH}/all-data`);
        expect(res.status).toBe(204);
    });

    it("Creating test base entries, directly without endpoint calls", async () => {

        const newBlog_1: BlogInputModel = {
            name: "blogger_001",
            description: "takoy sebe blogger...",
            websiteUrl: "https://takoy.blogger.com",
        }
        const insertedBlog_1 = await dataRepository.createNewBlog(newBlog_1);
        blogId_1 = insertedBlog_1.id;

        const newPost_1: PostInputModel = {
            title: "post blog 001",
            shortDescription: "post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_001",
            blogId: blogId_1,
        }
        await dataRepository.createNewPost(newPost_1);

        const newPost_2 =    {
            title: "post blog 002",
            shortDescription: "post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_002",
            blogId: blogId_1,
        }
        await dataRepository.createNewPost(newPost_2);

        const newBlog_2: BlogInputModel = {
            name: "blogger_002",
            description: "a eto klassnii blogger!",
            websiteUrl: "https://klassnii.blogger.com",
        }
        const insertedBlog_2 = await dataRepository.createNewBlog(newBlog_2);
        blogId_2 = insertedBlog_2.id;

        const newPost_3: PostInputModel = {
            title: "post blog 001",
            shortDescription: "horowii post",
            content: "Eto testovoe napolnenie posta 002_001",
            blogId: blogId_2,
        }
        await dataRepository.createNewPost(newPost_3);

        const newPost_4: PostInputModel = {
            title: "post blog 002",
            shortDescription: "horowii post",
            content: "Eto testovoe napolnenie posta 002_002",
            blogId: blogId_2,
        }
        await dataRepository.createNewPost(newPost_4);
    });
});





