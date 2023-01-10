import { prisma } from "./../../index";
import { Request, Response } from "express";

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
