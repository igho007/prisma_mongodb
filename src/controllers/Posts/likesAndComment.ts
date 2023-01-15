import { v4 } from "uuid";
import { prisma } from "./../../index";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

export const likePost = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });
  try {
    const posts = await prisma.post.findFirst({
      where: { postedById: req.params.post_id },
    });

    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });
    //   check if post is already liked

    const likeIndex = posts!.likes.map((like) => like.name).indexOf(user!.name);
    console.log(likeIndex);

    if (likeIndex !== 0) {
      console.log("Hello like this post");
      await prisma.post.update({
        where: { postedById: req.params.post_id },
        data: {
          likes: [{ name: user!.name, userId: user!.userId }, ...posts!.likes],
        },
      });
      return res.json({ success: true, msg: "post liked by user" });
    } else {
      console.log("here am i unlike tis post");
      posts!.likes.splice(likeIndex, 1);
      console.log(posts!.likes);
      await prisma.post.update({
        where: { postedById: req.params.post_id },
        data: { likes: [...posts!.likes] },
      });
      return res.json({ success: true, msg: "post unliked by the user" });
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const createComment = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });
    const post = await prisma.post.findFirst({
      where: { postedById: req.params.id },
    });
    if (!post)
      return res.status(400).json({ success: false, msg: "Post not found" });
    const updatedPost = await prisma.post.update({
      where: { postedById: req.params.id },
      data: {
        comments: [
          {
            name: user!.name,
            avatar: user!.avatar,
            text: req.body.text,
            commentId: v4(),
            createdAt: new Date().toDateString(),
          },
          ...post.comments,
        ],
      },
    });
    return res.json({ success: true, updatedPost });
  } catch (e) {
    throw new Error(e);
  }
};

export const DeleteCommentById = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });

    const post = await prisma.post.findFirst({
      where: { postedById: req.params.post_id },
    });
    if (!post)
      return res.status(400).json({ success: false, msg: "Post not found" });

    const userComment = post.comments.find(
      (comment) => comment.name === user!.name
    );
    if (userComment!.commentId !== req.params.comment_id)
      return res.status(403).json({ success: false, msg: "User not allowed " });

    const commentIndex = post.comments
      .map((comment) => comment.commentId)
      .indexOf(req.params.comment_id);
    post.comments.splice(commentIndex, 1);
    const updatedPost = await prisma.post.update({
      where: { postedById: req.params.post_id },
      data: {
        comments: [...post.comments],
      },
    });
    return res.json({ success: true, updatedPost });
  } catch (e) {
    throw new Error(e);
  }
};
