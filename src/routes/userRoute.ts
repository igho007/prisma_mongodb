import { getUser } from "./../controllers/users/getUsers";
import { register } from "../controllers/users/createAndLogin";
import express from "express";
import { check } from "express-validator";

const userRouter = express.Router();
userRouter.get("/register", getUser);

userRouter.post(
  "/register",
  [
    check("name").not().isEmpty().withMessage("Enter your name"),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Enter a valid email"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Must be at least 5 char long")
      .matches(/\d/)
      .withMessage("Must contain number"),
    check("password").custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("password confirmation incorret");
      }
    }),
  ],
  register
);

export { userRouter };
