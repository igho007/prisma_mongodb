"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = require("bcryptjs");
const express_validator_1 = require("express-validator");
const generateToken_1 = require("../../generateToken");
const index_1 = require("../../index");
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
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
//# sourceMappingURL=createAndLogin.js.map