"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const index_1 = require("./../../index");
const getUser = async (_, res) => {
    try {
        const users = await index_1.prisma.user.findMany();
        return res.status(200).json({ success: true, users });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getUser = getUser;
//# sourceMappingURL=getUsers.js.map