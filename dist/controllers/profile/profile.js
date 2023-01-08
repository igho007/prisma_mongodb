"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = void 0;
const express_validator_1 = require("express-validator");
const index_1 = require("./../../index");
const createProfile = async (req, res) => {
    console.log(req.user);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    try {
        if (!req.user)
            return res.status(403).json({ success: false, msg: "user not allowed" });
        const { company, location, website, skills, status, githubusername, bio, facebook, twitter, linkedin, youtube, } = req.body;
        const user = await index_1.prisma.user.findFirst({
            where: { email: req.user.email },
            include: { profile: true },
        });
        const profileFields = {};
        if (company)
            profileFields.company = company;
        if (website)
            profileFields.website = website;
        if (skills)
            profileFields.skills = skills;
        if (status)
            profileFields.status = status;
        if (githubusername)
            profileFields.githubusername = githubusername;
        if (bio)
            profileFields.bio = bio;
        profileFields.createdAt = new Date().toDateString();
        console.log(user === null || user === void 0 ? void 0 : user.id);
        const profile = await index_1.prisma.profile.upsert({
            where: { profileId: user.id.toString() },
            update: {
                company,
                location,
                status,
                skills: skills.split(",").map((skill) => skill.trim()),
                githubusername,
                bio,
                email: user.email,
                socials: { facebook, youtube, linkedin, twitter },
            },
            create: {
                company,
                location,
                status,
                skills: skills.split(",").map((skill) => skill.trim()),
                githubusername,
                bio,
                email: user.email,
                profileId: user.id,
                socials: {
                    youtube,
                    facebook,
                    twitter,
                    linkedin,
                },
                createdAt: new Date().toDateString(),
            },
        });
        return res.status(200).json({ success: true, profile });
    }
    catch (err) {
        throw new Error(err);
    }
};
exports.createProfile = createProfile;
//# sourceMappingURL=profile.js.map