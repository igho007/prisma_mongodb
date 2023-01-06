"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const generateToken_1 = require("../../generateToken");
const index_1 = require("../../index");
const register = async (req, res) => {
    try {
        console.log(123);
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            throw new Error("Please provide all fields");
        const user = await index_1.prisma.user.create({
            data: { name, email, password: await (0, bcryptjs_1.hash)(password, 12) },
        });
        (0, generateToken_1.cookieToken)(user, res);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.register = register;
//# sourceMappingURL=usersContollers.js.map