"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = void 0;
const index_1 = require("./../../index");
const getUsers = async (_, res) => {
    try {
        const users = await index_1.prisma.user.findMany();
        return res.status(200).json({ success: true, users });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getUsers = getUsers;
const getUser = async (req, res) => {
    if (!req.user)
        throw res.status(403).json({ success: false, msg: "User not allowed" });
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
        });
        const displayUser = {
            name: user.name,
            email: user.email,
            userId: user.userId,
            avatar: user.avatar,
            createdAt: user.createdAt,
        };
        return res.status(200).json({ success: true, user: displayUser });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getUser = getUser;
//# sourceMappingURL=getUsers.js.map