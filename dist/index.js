"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const userRoute_1 = require("./routes/userRoute");
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
dotenv_1.default.config();
exports.prisma = new client_1.PrismaClient();
async function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use((req, res, next) => {
        try {
            const token = req.cookies["token"];
            if (token) {
                const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
                req.user = decodedToken;
            }
            else {
                res.status(400).json({
                    success: false,
                    message: "no token",
                });
            }
        }
        catch (_a) { }
        next();
    });
    app.use("/api", userRoute_1.userRouter);
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