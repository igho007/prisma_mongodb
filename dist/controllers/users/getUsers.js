"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const getUser = (req, res) => {
    console.log(req.user);
    res.send("jusst needed to besure");
};
exports.getUser = getUser;
//# sourceMappingURL=getUsers.js.map