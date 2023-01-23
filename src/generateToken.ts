import { sign } from "jsonwebtoken";

export const generateToken = (user: any) => {
  return sign(
    { email: user.email, userId: user.userId, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  );
};
