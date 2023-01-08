"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfileAndUser = exports.getProfileByUserId = exports.getAllProfiles = exports.getCurrentUserProfile = void 0;
const index_1 = require("./../../index");
const getCurrentUserProfile = async (req, res) => {
    if (!req.user)
        return res.status(403).json({ success: false, msg: "user not allowed" });
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
        });
        const profile = await index_1.prisma.profile.findFirst({
            where: { profileId: user.id },
            include: { user: { select: { name: true, avatar: true } } },
        });
        if (!profile) {
            return res
                .status(400)
                .json({ success: false, msg: "There is no profile for this user" });
        }
        return res.status(200).json({ success: true, profile });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getCurrentUserProfile = getCurrentUserProfile;
const getAllProfiles = async (_, res) => {
    try {
        const profiles = await index_1.prisma.profile.findMany({
            include: { user: { select: { name: true, avatar: true } } },
        });
        return res.status(200).json({ success: true, profiles });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getAllProfiles = getAllProfiles;
const getProfileByUserId = async (req, res) => {
    try {
        const user = await index_1.prisma.user.findFirst({
            where: { userId: req.params.user_id },
        });
        const profile = await index_1.prisma.profile.findFirst({
            where: { profileId: user.id },
            include: {
                user: { select: { name: true, avatar: true } },
            },
        });
        if (!profile) {
            return res
                .status(400)
                .json({ success: false, msg: "No profile for this user" });
        }
        return res.status(200).json({ success: true, profile });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.getProfileByUserId = getProfileByUserId;
const deleteProfileAndUser = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ success: false, msg: "User bnot allowed" });
    }
    try {
        await index_1.prisma.user.delete({ where: { email: req.user.email } });
        await index_1.prisma.profile.delete({ where: { email: req.user.email } });
        return res
            .status(200)
            .json({ success: true, msg: "user profile deleted successfully" });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.deleteProfileAndUser = deleteProfileAndUser;
//# sourceMappingURL=queryProfile.js.map