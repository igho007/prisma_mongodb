"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEducation = exports.updateEducation = exports.AddEducation = void 0;
const express_validator_1 = require("express-validator");
const uuid_1 = require("uuid");
const index_1 = require("../../index");
const AddEducation = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ succes: false, errors: errors.array() });
    try {
        if (!req.user) {
            return res.status(403).json({ success: false, msg: "User not allowed" });
        }
        const { school, degree, fieldofstudy, from, to, current } = req.body;
        const profile = await index_1.prisma.profile.findFirst({
            where: { email: req.user.email },
        });
        if (!profile) {
            return res.status(400).json({ success: false, msg: "Profile not found" });
        }
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            educationId: (0, uuid_1.v4)(),
            createdAt: new Date().toDateString(),
        };
        const newProfile = await index_1.prisma.profile.update({
            where: { email: req.user.email },
            data: {
                education: [newEdu, ...profile.education],
            },
        });
        return res.status(200).json({ success: true, newProfile });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.AddEducation = AddEducation;
const updateEducation = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ success: false, msg: "User not allowed" });
    }
    const profile = await index_1.prisma.profile.findFirst({
        where: { email: req.user.email },
    });
    if (!profile)
        return res.status(400).json({ success: false, msg: "Profile not found" });
    const { school, degree, fieldofstudy, from, to, current } = req.body;
    const newExp = {
        school,
        degree,
        from,
        to,
        fieldofstudy,
        current,
        educationId: (0, uuid_1.v4)(),
        createdAt: new Date().toDateString(),
    };
    const educationIndex = profile.education
        .map((exp) => exp.educationId)
        .indexOf(req.params.exp_id);
    profile.education[educationIndex] = newExp;
    await index_1.prisma.profile.update({
        where: { email: req.user.email },
        data: {
            experience: [...profile.experience],
        },
    });
    return res.status(200).json({ success: true, msg: "education updated" });
};
exports.updateEducation = updateEducation;
const deleteEducation = async (req, res) => {
    if (!req.user) {
        return res.status(403).json({ success: false, msg: "User not allowed" });
    }
    const profile = await index_1.prisma.profile.findFirst({
        where: { email: req.user.email },
    });
    if (!profile)
        return res.status(400).json({ success: false, msg: "Profile not found" });
    const educationIndex = profile.education
        .map((exp) => exp.educationId)
        .indexOf(req.params.exp_id);
    const newExperience = profile.experience.splice(educationIndex, 1);
    await index_1.prisma.profile.update({
        where: { email: req.user.email },
        data: { experience: [...newExperience] },
    });
    return res
        .status(200)
        .json({ success: true, msg: "experience deleted successfully" });
};
exports.deleteEducation = deleteEducation;
//# sourceMappingURL=education.js.map