"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExperience = exports.updateExperience = exports.AddExperience = void 0;
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const index_1 = require("./../../index");
const AddExperience = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ succes: false, errors: errors.array() });
    try {
        if (!req.user) {
            return res.status(403).json({ success: false, msg: "User not allowed" });
        }
        const { title, company, location, from, to, current } = req.body;
        const profile = await index_1.prisma.profile.findFirst({
            where: { email: req.user.email },
        });
        if (!profile) {
            return res.status(400).json({ success: false, msg: "Profile not found" });
        }
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            experienceId: (0, uuid_1.v4)(),
            createdAt: new Date().toDateString(),
        };
        const newProfile = await index_1.prisma.profile.update({
            where: { email: req.user.email },
            data: {
                experience: [newExp, ...profile.experience],
            },
        });
        return res.status(200).json({ success: true, newProfile });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.AddExperience = AddExperience;
const updateExperience = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ success: false, msg: "User not allowed" });
    }
    const profile = await index_1.prisma.profile.findFirst({
        where: { email: req.user.email },
    });
    if (!profile)
        return res.status(400).json({ success: false, msg: "Profile not found" });
    const { title, company, location, from, to, current } = req.body;
    const newExp = {
        title,
        company,
        from,
        to,
        location,
        current,
        experienceId: (0, uuid_1.v4)(),
        createdAt: new Date().toDateString(),
    };
    const experienceIndex = profile.experience
        .map((exp) => exp.experienceId)
        .indexOf(req.params.exp_id);
    profile.experience[experienceIndex] = newExp;
    await index_1.prisma.profile.update({
        where: { email: req.user.email },
        data: {
            experience: [...profile.experience],
        },
    });
    return res.status(200).json({ success: true, msg: "experience updated" });
};
exports.updateExperience = updateExperience;
const deleteExperience = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ success: false, msg: "User not allowed" });
    }
    const profile = await index_1.prisma.profile.findFirst({
        where: { email: req.user.email },
    });
    if (!profile)
        return res.status(400).json({ success: false, msg: "Profile not found" });
    const experienceIndex = profile.experience
        .map((exp) => exp.experienceId)
        .indexOf(req.params.exp_id);
    const newExperience = profile.experience.splice(experienceIndex, 1);
    await index_1.prisma.profile.update({
        where: { email: req.user.email },
        data: { experience: [...newExperience] },
    });
    return res
        .status(200)
        .json({ success: true, msg: "experience deleted successfully" });
};
exports.deleteExperience = deleteExperience;
//# sourceMappingURL=createExpAndEdu.js.map