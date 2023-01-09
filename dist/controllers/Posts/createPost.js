"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
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
//# sourceMappingURL=createPost.js.map