"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const express_validator_1 = require("express-validator");
const gravatar_1 = require("gravatar");
const uuid_1 = require("uuid");
const index_1 = require("../../index");
const generateToken_1 = require("./../../generateToken");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const avatar = (0, gravatar_1.url)(email, { s: "200", r: "pg", d: "mm" });
        const user = await index_1.prisma.user.create({
            data: {
                name,
                email,
                password: await (0, bcryptjs_1.hash)(password, 12),
                userId: (0, uuid_1.v4)(),
                avatar,
                createdAt: new Date().toDateString(),
            },
        });
        const displayUser = {
            name: user.name,
            email: user.email,
            userId: user.userId,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
        const token = (0, generateToken_1.generateToken)(displayUser);
        return res.json({ sucess: true, token });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await index_1.prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid user/password" });
        }
        const isMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "invalid user/password",
            });
        }
        const displayUser = {
            name: user.name,
            email: user.email,
            userId: user.userId,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
        const token = (0, generateToken_1.generateToken)(displayUser);
        return res.json({ sucess: true, token });
    }
    catch (err) {
        console.log(err.response);
        throw err;
    }
};
exports.login = login;
//# sourceMappingURL=createAndLogin.js.map