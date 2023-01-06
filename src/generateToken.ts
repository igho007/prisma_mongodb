import { Response } from "express";
import { sign } from "jsonwebtoken";

export const generateToken = (user: any, res: Response) => {
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  const token = sign(
    { email: user.email, userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  );
  return res.cookie("token", token, options);
};
