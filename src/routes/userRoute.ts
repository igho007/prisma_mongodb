import { login } from "./../controllers/users/createAndLogin";
import { prisma } from "./../index";
import express from "express";
import { check } from "express-validator";
import { register } from "../controllers/users/createAndLogin";
import { getUser, getUsers } from "./../controllers/users/getUsers";

const userRouter = express.Router();
userRouter.get("/users", getUsers);
userRouter.get("/auth-user", getUser);

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
      .withMessage("Must be at least 6 char long"),

    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        console.log(req.body.confirmPassword);
        throw new Error("password mismatch");
      } else {
        return true;
      }
    }),
  ],
  register
);

export { userRouter };
