import express from "express";
import {setupApp} from "../src/setup-app";
import {dataRepository} from "../src/repository/blogger-mongodb-repository";
import request from "supertest";
import {TESTING_PATH} from "../src/routers/router-pathes";
import {HttpStatus} from "../src/core/http-statuses";
import {closeDB, runDB} from "../src/db/mongo.db";
import {BlogInputModel} from "../src/routers/router-types/blog-input-model";
import {PostInputModel} from "../src/routers/router-types/post-input-model";

describe("Test API commands for testing", () => {
    it("DELETE ALL '/api/testing/all-data/' - should delete whole repository", async() => {
        const testApp = express();
        setupApp(testApp);
        await runDB();

        //expect(dataRepository.returnLength()).toBe(2);
        const res = await request(testApp).delete(`${TESTING_PATH}/all-data/`);
        expect(await dataRepository.returnBloggersAmount()).toBe(0);

        expect(res.status).toBe(HttpStatus.NoContent);
    });

    afterAll(async () => {
        // Закрываем после всех тестов
        await closeDB();
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