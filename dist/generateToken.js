"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateToken = (user) => {
    return (0, jsonwebtoken_1.sign)({ email: user.email, userId: user.userId, name: user.name }, process.env.JWT_SECRET, { expiresIn: "2h" });
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map