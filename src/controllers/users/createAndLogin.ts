import { hash } from "bcryptjs";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { url } from "gravatar";
import { v4 } from "uuid";
import { cookieToken } from "../../generateToken";
import { prisma } from "../../index";

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

    cookieToken(user, res);
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    throw new Error(error);
  }
};
