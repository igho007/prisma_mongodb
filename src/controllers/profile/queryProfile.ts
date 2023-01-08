import { prisma } from "./../../index";
import { Request, Response } from "express";

export const getCurrentUserProfile = async (req: Request, res: Response) => {
  if (!req.user)
    return res.status(403).json({ success: false, msg: "user not allowed" });
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
    });
    const profile = await prisma.profile.findFirst({
      where: { profileId: user!.id },
      include: { user: { select: { name: true, avatar: true } } },
    });

    if (!profile) {
      return res
        .status(400)
        .json({ success: false, msg: "There is no profile for this user" });
    }
    return res.status(200).json({ success: true, profile });
  } catch (err) {
    throw new Error(err);
  }
};

export const getAllProfiles = async (_: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: { user: { select: { name: true, avatar: true } } },
    });
    return res.status(200).json({ success: true, profiles });
  } catch (err) {
    throw new Error(err);
  }
};

export const getProfileByUserId = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { userId: req.params.user_id },
    });

    const profile = await prisma.profile.findFirst({
      where: { profileId: user!.id },
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
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteProfileAndUser = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(403).json({ success: false, msg: "User bnot allowed" });
  }
  try {
    await prisma.user.delete({ where: { email: req.user.email } });
    await prisma.profile.delete({ where: { email: req.user.email } });
    return res
      .status(200)
      .json({ success: true, msg: "user profile deleted successfully" });
  } catch (err) {
    throw new Error(err);
  }
};
