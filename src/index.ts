import { postRouter } from "./routes/postRoute";
import { userRouter } from "./routes/userRoute";
import { PrismaClient } from "@prisma/client";

import cookieParser from "cookie-parser";
import dotEnv from "dotenv";

import express, { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { profileRouter } from "./routes/profileRoute";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

dotEnv.config();

export const prisma = new PrismaClient();

async function main() {
  const app = express();
  // regular middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // cookie parser middleware
  app.use(cookieParser());

  app.use((req: Request, _: Response, next) => {
    console.log(req.headers["x-auth"]);
    try {
      const token = req.headers["x-auth"];

      if (token) {
        const decodedToken = verify(
          token as string,
          process.env.JWT_SECRET as string
        );
        console.log(decodedToken);
        req.user = decodedToken;
      }
    } catch {}
    next();
  });

  app.use("/api/user", userRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/posts", postRouter);
  app.get("/", (_, res) => {
    res.send("Hello");
  });

  // Connect the client
  await prisma.$connect();
  // ... you will write your Prisma Client queries here

  app.listen(5000, () => console.log("app running on port 5000"));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
