import { userRouter } from "./routes/userRoute";
import { PrismaClient } from "@prisma/client";

import cookieParser from "cookie-parser";
import dotEnv from "dotenv";

import express from "express";

dotEnv.config();
export const prisma = new PrismaClient();

async function main() {
  const app = express();
  // regular middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // cookie parser middleware
  app.use(cookieParser());

  app.use("/api", userRouter);
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
