import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { url } from "gravatar";
import { v4 } from "uuid";
import { prisma } from "../../index";
import { generateToken } from "./../../generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const avatar = url(email, { s: "200", r: "pg", d: "mm" });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password, 12),
        userId: v4(),
        avatar,
        createdAt: new Date().toDateString(),
      },
    });

    generateToken(user, res);
    return res.status(200).json({ success: true, msg: "user registered" });
  } catch (error) {
    throw new Error(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid user/password" });
    }
    const isMatch = await compare(password, user!.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "invalid user/password",
      });
    }
    generateToken(user, res);
    return res.status(200).json({ success: true, msg: "user login" });
  } catch (err) {
    throw err;
  }
};
