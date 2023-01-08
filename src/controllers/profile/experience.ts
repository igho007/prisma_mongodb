import { validationResult } from "express-validator";
import { v4 } from "uuid";
import { prisma } from "../../index";
import { Request, Response } from "express";

export const AddExperience = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ succes: false, errors: errors.array() });

  try {
    if (!req.user) {
      return res.status(403).json({ success: false, msg: "User not allowed" });
    }

    const { title, company, location, from, to, current } = req.body;
    const profile = await prisma.profile.findFirst({
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
      experienceId: v4(),
      createdAt: new Date().toDateString(),
    };

    const newProfile = await prisma.profile.update({
      where: { email: req.user.email },
      data: {
        experience: [newExp, ...profile!.experience],
      },
    });

    return res.status(200).json({ success: true, newProfile });
  } catch (err) {
    throw new Error(err);
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, msg: "User not allowed" });
  }

  const profile = await prisma.profile.findFirst({
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
    experienceId: v4(),
    createdAt: new Date().toDateString(),
  };
  const experienceIndex = profile.experience
    .map((exp) => exp.experienceId)
    .indexOf(req.params.exp_id);

  profile.experience[experienceIndex] = newExp;
  await prisma.profile.update({
    where: { email: req.user.email },
    data: {
      experience: [...profile.experience],
    },
  });
  return res.status(200).json({ success: true, msg: "experience updated" });
};

export const deleteExperience = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, msg: "User not allowed" });
  }

  const profile = await prisma.profile.findFirst({
    where: { email: req.user.email },
  });
  if (!profile)
    return res.status(400).json({ success: false, msg: "Profile not found" });

  const experienceIndex = profile.experience
    .map((exp) => exp.experienceId)
    .indexOf(req.params.exp_id);

  const newExperience = profile.experience.splice(experienceIndex, 1);

  await prisma.profile.update({
    where: { email: req.user.email },
    data: { experience: [...newExperience] },
  });
  return res
    .status(200)
    .json({ success: true, msg: "experience deleted successfully" });
};
