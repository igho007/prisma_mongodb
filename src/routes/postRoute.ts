import { createPost } from "./../controllers/Posts/createPost";
import { check } from "express-validator";
import { Router } from "express";

export const postRouter = Router();
postRouter.post(
  "/create-post",
  [check("text", "Enter text").not().isEmpty()],
  createPost
);
