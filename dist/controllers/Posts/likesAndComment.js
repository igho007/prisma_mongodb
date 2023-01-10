"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = void 0;
const index_1 = require("./../../index");
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
//# sourceMappingURL=likesAndComment.js.map