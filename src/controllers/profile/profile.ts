import { validationResult } from "express-validator";
import { prisma } from "./../../index";
import { Request, Response } from "express";

export const createProfile = async (req: Request, res: Response) => {
  console.log(req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    if (!req.user)
      return res.status(403).json({ success: false, msg: "user not allowed" });

    const {
      company,
      location,
      website,
      skills,
      status,
      githubusername,
      bio,
      facebook,
      twitter,
      linkedin,
      youtube,
    } = req.body;
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
      include: { profile: true },
    });

    interface ProfileFields {
      [key: string]: string;
    }

    const profileFields: ProfileFields = {};
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (skills) profileFields.skills = skills;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (bio) profileFields.bio = bio;

    profileFields.createdAt = new Date().toDateString();
    console.log(user?.id);
    const profile = await prisma.profile.upsert({
      where: { profileId: user!.id.toString() },
      update: {
        company,
        location,
        status,
        skills: skills.split(",").map((skill: string) => skill.trim()),
        githubusername,
        bio,
        email: user!.email,
        socials: { facebook, youtube, linkedin, twitter },
      },
      create: {
        company,
        location,
        status,
        skills: skills.split(",").map((skill: string) => skill.trim()),
        githubusername,
        bio,
        email: user!.email,
        profileId: user!.id,
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
  } catch (err) {
    throw new Error(err);
  }
};
