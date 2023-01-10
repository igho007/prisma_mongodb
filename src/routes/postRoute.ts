import { likePost } from "./../controllers/Posts/likesAndComment";
import {
  createPost,
  deletePostById,
  getPostById,
  getPosts,
} from "./../controllers/Posts/createPost";
import { check } from "express-validator";
import { Router } from "express";

export const postRouter = Router();
postRouter.post(
  "/create-post",
  [check("text", "Enter text").not().isEmpty()],
  createPost
);

postRouter.get("/", getPosts);
postRouter.get("/post/:post_id", getPostById);

postRouter.delete("/post/:post_id", deletePostById);

postRouter.put("/post/likes/:post_id", likePost);
