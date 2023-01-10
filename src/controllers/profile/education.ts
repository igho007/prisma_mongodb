import { validationResult } from "express-validator";
import { v4 } from "uuid";
import { prisma } from "../../index";
import { Request, Response } from "express";

export const AddEducation = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ succes: false, errors: errors.array() });

  try {
    if (!req.user) {
      return res.status(403).json({ success: false, msg: "User not allowed" });
    }

    const { school, degree, fieldofstudy, from, to, current } = req.body;
    const profile = await prisma.profile.findFirst({
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
      educationId: v4(),
      createdAt: new Date().toDateString(),
    };

    const newProfile = await prisma.profile.update({
      where: { email: req.user.email },
      data: {
        education: [newEdu, ...profile!.education],
      },
    });

    return res.status(200).json({ success: true, newProfile });
  } catch (err) {
    throw new Error(err);
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, msg: "User not allowed" });
  }

  const profile = await prisma.profile.findFirst({
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
    educationId: v4(),
    createdAt: new Date().toDateString(),
  };
  const educationIndex = profile.education
    .map((exp) => exp.educationId)
    .indexOf(req.params.exp_id);

  profile.education[educationIndex] = newExp;
  await prisma.profile.update({
    where: { email: req.user.email },
    data: {
      experience: [...profile.experience],
    },
  });
  return res.status(200).json({ success: true, msg: "education updated" });
};

export const deleteEducation = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, msg: "User not allowed" });
  }

  const profile = await prisma.profile.findFirst({
    where: { email: req.user.email },
  });
  if (!profile)
    return res.status(400).json({ success: false, msg: "Profile not found" });

  const educationIndex = profile.education
    .map((exp) => exp.educationId)
    .indexOf(req.params.exp_id);

  profile.education.splice(educationIndex, 1);

  await prisma.profile.update({
    where: { email: req.user.email },
    data: { education: [...profile.education] },
  });
  return res
    .status(200)
    .json({ success: true, msg: "experience deleted successfully" });
};
