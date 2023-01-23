import { prisma } from "./../../index";
import { Response, Request } from "express";

export const getUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    throw new Error(err);
  }
};

export const getUser = async (req: Request, res: Response) => {
  if (!req.user) {
    throw res.status(403).json({ success: false, msg: "User not allowed" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });
    const displayUser = {
      name: user!.name,
      email: user!.email,
      userId: user!.userId,
      avatar: user!.avatar,
      createdAt: user!.createdAt,
    };
    return res.status(200).json({ success: true, user: displayUser });
  } catch (err) {
    throw new Error(err);
  }
};
