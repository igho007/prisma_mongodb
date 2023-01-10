import { v4 } from "uuid";
import { validationResult } from "express-validator";
import { prisma } from "./../../index";

import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
      include: { posts: true },
    });

    //   const result = await prisma.$transaction([])

    const post = await prisma.post.createMany({
      data: [
        {
          text: req.body.text,
          avatar: user!.avatar,
          postId: user!.id,
          name: user!.name,
          postedById: v4(),
          createdAt: new Date().toDateString(),
        },
      ],
    });

    return res.status(200).json({ success: true, post });
  } catch (err) {
    throw new Error(err);
  }
};

export const getPosts = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: "asc" } });
    return res.status(200).json({ success: true, posts });
  } catch (err) {
    throw new Error(err);
  }
};

export const getPostById = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "User not allowed" });
  try {
    const post = await prisma.post.findFirst({
      where: { postedById: req.params.post_id },
    });
    return res.status(200).json({ success: true, post });
  } catch (err) {
    throw new Error(err);
  }
};

export const deletePostById = async (req: Request, res: Response) => {
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
    if (post.name !== user!.name)
      return res.status(403).json({ success: false, msg: "User not allowed" });
    await prisma.post.delete({ where: { id: post!.id } });

    return res
      .status(200)
      .json({ success: true, msg: "post deleted successfully" });
  } catch (err) {
    throw new Error(err);
  }
};
