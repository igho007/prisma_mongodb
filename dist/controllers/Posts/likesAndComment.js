"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCommentById = exports.createComment = exports.likePost = void 0;
const uuid_1 = require("uuid");
const index_1 = require("./../../index");
const express_validator_1 = require("express-validator");
const likePost = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    try {
        const posts = await index_1.prisma.post.findFirst({
            where: { postedById: req.params.post_id },
        });
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
        });
        const likeIndex = posts.likes.map((like) => like.name).indexOf(user.name);
        console.log(likeIndex);
        if (likeIndex !== 0) {
            console.log("Hello like this post");
            await index_1.prisma.post.update({
                where: { postedById: req.params.post_id },
                data: {
                    likes: [{ name: user.name, userId: user.userId }, ...posts.likes],
                },
            });
            return res.json({ success: true, msg: "post liked by user" });
        }
        else {
            console.log("here am i unlike tis post");
            posts.likes.splice(likeIndex, 1);
            console.log(posts.likes);
            await index_1.prisma.post.update({
                where: { postedById: req.params.post_id },
                data: { likes: [...posts.likes] },
            });
            return res.json({ success: true, msg: "post unliked by the user" });
        }
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.likePost = likePost;
const createComment = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "User not allowed" });
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
        });
        const post = await index_1.prisma.post.findFirst({
            where: { postedById: req.params.id },
        });
        if (!post)
            return res.status(400).json({ success: false, msg: "Post not found" });
        const updatedPost = await index_1.prisma.post.update({
            where: { postedById: req.params.id },
            data: {
                comments: [
                    {
                        name: user.name,
                        avatar: user.avatar,
                        text: req.body.text,
                        commentId: (0, uuid_1.v4)(),
                        createdAt: new Date().toDateString(),
                    },
                    ...post.comments,
                ],
            },
        });
        return res.json({ success: true, updatedPost });
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.createComment = createComment;
const DeleteCommentById = async (req, res) => {
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
        const userComment = post.comments.find((comment) => comment.name === user.name);
        if (userComment.commentId !== req.params.comment_id)
            return res.status(403).json({ success: false, msg: "User not allowed " });
        const commentIndex = post.comments
            .map((comment) => comment.commentId)
            .indexOf(req.params.comment_id);
        post.comments.splice(commentIndex, 1);
        const updatedPost = await index_1.prisma.post.update({
            where: { postedById: req.params.post_id },
            data: {
                comments: [...post.comments],
            },
        });
        return res.json({ success: true, updatedPost });
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.DeleteCommentById = DeleteCommentById;
//# sourceMappingURL=likesAndComment.js.map