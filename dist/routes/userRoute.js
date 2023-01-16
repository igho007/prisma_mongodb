"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const createAndLogin_1 = require("./../controllers/users/createAndLogin");
const index_1 = require("./../index");
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const createAndLogin_2 = require("../controllers/users/createAndLogin");
const getUsers_1 = require("./../controllers/users/getUsers");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.get("/register", getUsers_1.getUser);
userRouter.post("/login", createAndLogin_1.login);
userRouter.post("/register", [
    (0, express_validator_1.check)("name").not().isEmpty().withMessage("Enter your name"),
    (0, express_validator_1.check)("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Enter a valid email"),
    (0, express_validator_1.check)("email").custom(async (value) => {
        const user = await index_1.prisma.user.findUnique({ where: { email: value } });
        if (user) {
            throw new Error("Email is taken");
        }
    }),
    (0, express_validator_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Must be at least 6 char long"),
    (0, express_validator_1.check)("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            console.log(req.body.confirmPassword);
            throw new Error("password mismatch");
        }
        else {
            return true;
        }
    }),
], createAndLogin_2.register);
//# sourceMappingURL=userRoute.js.map