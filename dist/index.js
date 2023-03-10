"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const postRoute_1 = require("./routes/postRoute");
const userRoute_1 = require("./routes/userRoute");
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const profileRoute_1 = require("./routes/profileRoute");
dotenv_1.default.config();
exports.prisma = new client_1.PrismaClient();
async function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((req, _, next) => {
        console.log(req.headers["x-auth"]);
        try {
            const token = req.headers["x-auth"];
            if (token) {
                const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                console.log(decodedToken);
                req.user = decodedToken;
            }
        }
        catch (_a) { }
        next();
    });
    app.use("/api/user", userRoute_1.userRouter);
    app.use("/api/profile", profileRoute_1.profileRouter);
    app.use("/api/posts", postRoute_1.postRouter);
    app.get("/", (_, res) => {
        res.send("Hello");
    });
    await exports.prisma.$connect();
    app.listen(5000, () => console.log("app running on port 5000"));
}
main()
    .then(async () => {
    await exports.prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await exports.prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=index.js.map