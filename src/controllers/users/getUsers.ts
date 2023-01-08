import { prisma } from "./../../index";
import { Response, Request } from "express";

export const getUser = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({ success: true, users });
  } catch (err) {
    throw new Error(err);
  }
};
