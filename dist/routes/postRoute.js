"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const likesAndComment_1 = require("./../controllers/Posts/likesAndComment");
const createPost_1 = require("./../controllers/Posts/createPost");
const express_validator_1 = require("express-validator");
const express_1 = require("express");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.post("/create-post", [(0, express_validator_1.check)("text", "Enter text").not().isEmpty()], createPost_1.createPost);
exports.postRouter.get("/", createPost_1.getPosts);
exports.postRouter.get("/post/:post_id", createPost_1.getPostById);
exports.postRouter.delete("/post/:post_id", createPost_1.deletePostById);
exports.postRouter.put("/post/likes/:post_id", likesAndComment_1.likePost);
//# sourceMappingURL=postRoute.js.map