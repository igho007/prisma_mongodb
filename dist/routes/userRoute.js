"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const getUsers_1 = require("./../controllers/users/getUsers");
const createAndLogin_1 = require("../controllers/users/createAndLogin");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/register", getUsers_1.getUser);
userRouter.post("/register", [
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("Enter your name"),
    (0, express_validator_1.check)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Enter a valid email"),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Must be at least 5 char long")
        .matches(/\d/)
        .withMessage("Must contain number"),
    (0, express_validator_1.check)("password").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            throw new Error("password confirmation incorret");
        }
    }),
], createAndLogin_1.register);
//# sourceMappingURL=userRoute.js.map