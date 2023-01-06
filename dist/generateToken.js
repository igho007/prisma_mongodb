"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (user, res) => {
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    const token = (0, jsonwebtoken_1.sign)({ email: user.email, userId: user.id }, process.env.JWT_SECRET, { expiresIn: "2h" });
    return res.cookie("token", token, options);
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map