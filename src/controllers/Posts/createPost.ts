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
        },
      ],
    });

    return res.status(200).json({ success: true, post });
  } catch (err) {
    throw new Error(err);
  }
};
