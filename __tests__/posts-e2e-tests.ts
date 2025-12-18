import express from "express";
import {setupApp} from "../src/setup-app";
import {PostInputModel} from "../src/routers/router-types/post-input-model";
import {dataRepository} from "../src/repository/blogger-mongodb-repository";
import request from "supertest";
import {POSTS_PATH, TESTING_PATH} from "../src/routers/router-pathes";
import {HttpStatus} from "../src/core/http-statuses";
import {closeDB, runDB} from "../src/db/mongo.db";
import {BlogInputModel} from "../src/routers/router-types/blog-input-model";

describe("Test API for managing posts inside blogs", () =>{
    const testApp = express();
    setupApp(testApp);

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

    it("", async () => {
        const res = await request(testApp).delete(`${TESTING_PATH}/all-data`);
        expect(res.status).toBe(204);
    });

    let blogId_1:string = '';
    let blogId_2:string = '';
    let postId_1:string = '';
    let postId_2:string = '';
    let postId_3:string = '';
    let postId_4:string = '';


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
        const insertedPost_1 = await dataRepository.createNewPost(newPost_1);
        if (!insertedPost_1)
        {
            throw new Error('Failed to createNewPost, returned undefined...');
        }
        postId_1 = insertedPost_1.id;

        const newPost_2 =    {
            title: "post blog 002",
            shortDescription: "post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_002",
            blogId: blogId_1,
        }
        const insertedPost_2 = await dataRepository.createNewPost(newPost_2);
        if (!insertedPost_2)
        {
            throw new Error('Failed to createNewPost, returned undefined...');
        }
        postId_2 = insertedPost_2.id;

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
        const insertedPost_3 = await dataRepository.createNewPost(newPost_3);
        if (!insertedPost_3)
        {
            throw new Error('Failed to createNewPost, returned undefined...');
        }
        postId_3 = insertedPost_3.id;

        const newPost_4: PostInputModel = {
            title: "post blog 002",
            shortDescription: "horowii post",
            content: "Eto testovoe napolnenie posta 002_002",
            blogId: blogId_2,
        }
        await dataRepository.createNewPost(newPost_4);
    });



    it("GET '/api/posts/' - should respond with a list of posts (4 entries total)", async() => {

        expect(await dataRepository.returnBloggersAmount()).toBe(2);

        const res = await request(testApp).get(`${POSTS_PATH}/`);

        const entriesCount = Object.entries(res.body).length;
        expect(entriesCount).toBe(4);

        expect(res.status).toBe(HttpStatus.Ok);
    });

    // const correctPostInput: PostInputModel = {
    //     title: "post blog 003",
    //     shortDescription: "o4erednoy post ni o 4em",
    //     content: "Eto testovoe napolnenie posta 001_003",
    //     blogId: blogId_1
    // };

    it("POST '/api/posts/' - should add a post to the repository", async() => {
        // удивительно, но этот объект не видно изнутри! если объявить его снаружи, он не отправится
        const correctPostInput: PostInputModel = {
            title: "post blog 003",
            shortDescription: "o4erednoy post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_003",
            blogId: blogId_1
        };

        const res = await request(testApp).post(`${POSTS_PATH}/`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5').send(correctPostInput);

        const propertyCount = Object.keys(res.body).length;

        expect(propertyCount).toBe(7);

        expect(res.body.id).toBeDefined();
        expect(res.body.blogName).toBeDefined();

        expect(typeof res.body.id).toBe('string');
        expect(typeof res.body.blogName).toBe('string');

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('title', 'post blog 003');
        expect(res.body).toHaveProperty('shortDescription', 'o4erednoy post ni o 4em');
        expect(res.body).toHaveProperty('content', 'Eto testovoe napolnenie posta 001_003');
        expect(res.body).toHaveProperty('blogId', blogId_1);
        expect(res.body).toHaveProperty('blogName', 'blogger_001');
        expect(res.body).toHaveProperty('createdAt');

        expect(res.status).toBe(HttpStatus.Created);
    });

    it("POST '/api/posts/' - shouldn't be able to add a post to the repository because of incorrect login/password pair", async() => {

        const correctPostInput: PostInputModel = {
            title: "post blog 003",
            shortDescription: "o4erednoy post ni o 4em",
            content: "Eto testovoe napolnenie posta 001_003",
            blogId: blogId_1
        };

        const res = await request(testApp).post(`${POSTS_PATH}/`).set('Authorization', 'Basic ' + '111111').send(correctPostInput);
        expect(res.status).toBe(HttpStatus.Unauthorized);

        const anotherRes = await request(testApp).post(`${POSTS_PATH}/`).set('Authorization', '111111 ' + 'YWRtaW46cXdlcnR5').send(correctPostInput);
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
    });

    it("GET '/api/posts/{id}' - should find a post entry and respond with a PostViewModel-formatted info about a requested post", async() => {

        const res = await request(testApp).get(`${POSTS_PATH}/${postId_3}`);

        const propertyCount = Object.keys(res.body).length;
        expect(propertyCount).toBe(7);

        expect(res.body).toHaveProperty('id', postId_3);
        expect(res.body).toHaveProperty('title', 'post blog 001');
        expect(res.body).toHaveProperty('shortDescription', 'horowii post');
        expect(res.body).toHaveProperty('content', 'Eto testovoe napolnenie posta 002_001');
        expect(res.body).toHaveProperty('blogId', blogId_2);
        expect(res.body).toHaveProperty('blogName', 'blogger_002');
        expect(res.body).toHaveProperty('createdAt');

        expect(res.status).toBe(HttpStatus.Ok);
    });

    it("GET '/api/posts/{id}' - shouldn't be able to insert a post because of non-existent blog ID, should respond with proper error-return message", async() => {

        const res = await request(testApp).get(`${POSTS_PATH}/0000`);
        expect(res.status).toBe(HttpStatus.BadRequest);
    });

    it("PUT '/api/posts/{id}' - should update a post", async() => {

        const updatedPostInput: PostInputModel = {
            title: "post blog 001",
            shortDescription: "OBNOVLENNII post - ni o 4em",
            content: "Eto OBNOVLENNOE testovoe napolnenie posta 001_003",
            blogId: blogId_2
        };

        const res = await request(testApp).put(`${POSTS_PATH}/${postId_3}`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5').send(updatedPostInput);
        expect(res.status).toBe(HttpStatus.NoContent);

        const anotherResults = await request(testApp).get(`${POSTS_PATH}/${postId_3}`);
        expect(anotherResults).toBeDefined();
        const propertyCount = Object.keys(anotherResults.body).length;
        expect(propertyCount).toBe(7);
        expect(anotherResults.status).toBe(HttpStatus.Ok);

        expect(anotherResults.body).toHaveProperty('id', postId_3);
        expect(anotherResults.body).toHaveProperty('title', 'post blog 001');
        expect(anotherResults.body).toHaveProperty('shortDescription', 'OBNOVLENNII post - ni o 4em');
        expect(anotherResults.body).toHaveProperty('content', 'Eto OBNOVLENNOE testovoe napolnenie posta 001_003');
        expect(anotherResults.body).toHaveProperty('blogId', blogId_2);
        expect(anotherResults.body).toHaveProperty('blogName', 'blogger_002');
        expect(anotherResults.body).toHaveProperty('createdAt');
    });

    it("PUT '/api/posts/{id}' - shouldn't be able to update a post because of incorrect login/password pair", async() => {

        const updatedPostInput: PostInputModel = {
            title: "post blog 001",
            shortDescription: "OBNOVLENNII post - ni o 4em",
            content: "Eto OBNOVLENNOE testovoe napolnenie posta 001_003",
            blogId: blogId_2
        };

        const res = await request(testApp).put(`${POSTS_PATH}/${postId_3}`).set('Authorization', 'Basic ' + '111111').send(updatedPostInput);
        expect(res.status).toBe(HttpStatus.Unauthorized);

        const anotherRes = await request(testApp).put(`${POSTS_PATH}/${postId_3}`).set('Authorization', '111111 ' + 'YWRtaW46cXdlcnR5').send(updatedPostInput);
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
    });

    it("DELETE '/api/posts/{id}' - shouldn't be able to delete a post because of incorrect login/password pair", async() => {

        const res = await request(testApp).delete(`${POSTS_PATH}/${postId_3}`).set('Authorization', 'Basic ' + '111111');
        expect(res.status).toBe(HttpStatus.Unauthorized);

        const anotherRes = await request(testApp).delete(`${POSTS_PATH}/${postId_3}`).set('Authorization', '111111 ' + 'YWRtaW46cXdlcnR5');
        expect(anotherRes.status).toBe(HttpStatus.Unauthorized);
    });

    // .set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5')
    // const res = await request(testApp).post(`${BLOGS_PATH}/`).set('Authorization', 'Basic ' + '111111').send(correctBlogInput);
    // expect(res.status).toBe(HttpStatus.Unauthorized);
    //
    // const anotherRes = await request(testApp).post(`${BLOGS_PATH}/`).set('Authorization', '111111 ' + 'YWRtaW46cXdlcnR5').send(correctBlogInput);
    // expect(anotherRes.status).toBe(HttpStatus.Unauthorized);

    it("DELETE '/api/posts/{id}' - should delete a post", async() => {

        const res = await request(testApp).delete(`${POSTS_PATH}/${postId_3}`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5');
        expect(res.status).toBe(HttpStatus.NoContent);

        const anotherResults = await request(testApp).get(`${POSTS_PATH}/${postId_3}`).set('Authorization', 'Basic ' + 'YWRtaW46cXdlcnR5');
        expect(anotherResults.status).toBe(HttpStatus.NotFound);
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