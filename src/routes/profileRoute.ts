import {
  AddExperience,
  deleteExperience,
  updateExperience,
} from "./../controllers/profile/createExpAndEdu";
import {
  deleteProfileAndUser,
  getAllProfiles,
  getCurrentUserProfile,
} from "./../controllers/profile/queryProfile";
import { check } from "express-validator";
import { createProfile } from "./../controllers/profile/profile";
import express from "express";

const profileRouter = express.Router();

// create profile
profileRouter.post(
  "/create-profile",
  [
    check("status", "Enter your status").not().isEmpty(),
    check("skills", "Enter at least a skill").isLength({ min: 1 }),
  ],
  createProfile
);

profileRouter.get("/me", getCurrentUserProfile);
profileRouter.get("/profiles", getAllProfiles);

profileRouter.put(
  "/experience",
  [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Title company is required").not().isEmpty(),
  ],
  AddExperience
);

profileRouter.put("/experience/:exp_id", updateExperience);

profileRouter.delete("/", deleteProfileAndUser);
profileRouter.delete("/experience/:exp_id", deleteExperience);

export { profileRouter };
