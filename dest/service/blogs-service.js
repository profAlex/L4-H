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
exports.blogsService = void 0;
const blogger_mongodb_repository_1 = require("../repository/blogger-mongodb-repository");
exports.blogsService = {
    getSeveralBlogs(sentInputGetDriverQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.getSeveralBlogs(sentInputGetDriverQuery);
        });
    },
    createNewBlog(newBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.createNewBlog(newBlog);
        });
    },
    getAllPostsFromBlog(sentBlogId, sent) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.getSeveralPosts(sentBlogId, sent);
        });
    },
    findSingleBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.findSingleBlog(blogId);
        });
    },
    updateBlog(blogId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.updateBlog(blogId, newData);
        });
    },
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogger_mongodb_repository_1.dataRepository.deleteBlog(blogId);
        });
    },
};
