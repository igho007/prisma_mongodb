import { login } from "./../controllers/users/createAndLogin";
import { prisma } from "./../index";
import express from "express";
import { check } from "express-validator";
import { register } from "../controllers/users/createAndLogin";
import { getUser } from "./../controllers/users/getUsers";

const userRouter = express.Router();
userRouter.get("/register", getUser);

userRouter.post("/login", login);

userRouter.post(
  "/register",
  [
    check("name").not().isEmpty().withMessage("Enter your name"),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Enter a valid email"),
    check("email").custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error("Email is taken");
      }
    }),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Must be at least 5 char long")
      .matches(/\d/)
      .withMessage("Must contain number"),
  ],
  register
);

export { userRouter };
