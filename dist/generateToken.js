"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (userId) => (0, jsonwebtoken_1.sign)({ userId }, process.env.JWT_SECRET, { expiresIn: "2h" });
exports.generateToken = generateToken;
const cookieToken = (user, res) => {
    const token = (0, exports.generateToken)(user.id);
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
    });
};
exports.cookieToken = cookieToken;
//# sourceMappingURL=generateToken.js.map