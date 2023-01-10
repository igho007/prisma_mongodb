"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const index_1 = require("./../../index");
const createPost = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
            include: { posts: true },
        });
        const post = await index_1.prisma.post.createMany({
            data: [
                {
                    text: req.body.text,
                    avatar: user.avatar,
                    postId: user.id,
                    name: user.name,
                    postedById: (0, uuid_1.v4)(),
                    createdAt: new Date().toDateString(),
                },
            ],
        });
        return res.status(200).json({ success: true, post });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    try {
        const posts = await index_1.prisma.post.findMany({ orderBy: { createdAt: "asc" } });
        return res.status(200).json({ success: true, posts });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getPosts = getPosts;
const getPostById = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    try {
        const post = await index_1.prisma.post.findFirst({
            where: { postedById: req.params.post_id },
        });
        return res.status(200).json({ success: true, post });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getPostById = getPostById;
const deletePostById = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
        });
        const post = await index_1.prisma.post.findFirst({
            where: { postedById: req.params.post_id },
        });
        if (!post)
            return res.status(400).json({ success: false, msg: "Post not found" });
        if (post.name !== user.name)
            return res.status(403).json({ success: false, msg: "User not allowed" });
        await index_1.prisma.post.delete({ where: { id: post.id } });
        return res
            .status(200)
            .json({ success: true, msg: "post deleted successfully" });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.deletePostById = deletePostById;
//# sourceMappingURL=createPost.js.map