"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const education_1 = require("./../controllers/profile/education");
const experience_1 = require("../controllers/profile/experience");
const queryProfile_1 = require("./../controllers/profile/queryProfile");
const express_validator_1 = require("express-validator");
const profile_1 = require("./../controllers/profile/profile");
const express_1 = __importDefault(require("express"));
const profileRouter = express_1.default.Router();
exports.profileRouter = profileRouter;
profileRouter.post("/create-profile", [
    (0, express_validator_1.check)("status", "Enter your status").not().isEmpty(),
    (0, express_validator_1.check)("skills", "Enter at least a skill").isLength({ min: 1 }),
], profile_1.createProfile);
profileRouter.get("/me", queryProfile_1.getCurrentUserProfile);
profileRouter.get("/profiles", queryProfile_1.getAllProfiles);
profileRouter.put("/experience", [
    (0, express_validator_1.check)("title", "Title is required").not().isEmpty(),
    (0, express_validator_1.check)("company", "company is required").not().isEmpty(),
], experience_1.AddExperience);
profileRouter.put("/education", [
    (0, express_validator_1.check)("school", "School is required").not().isEmpty(),
    (0, express_validator_1.check)("degree", "Degree is required").not().isEmpty(),
], education_1.AddEducation);
profileRouter.put("/experience/:exp_id", experience_1.updateExperience);
profileRouter.put("/education/:exp_id", education_1.updateEducation);
profileRouter.delete("/", queryProfile_1.deleteProfileAndUser);
profileRouter.delete("/experience/:exp_id", experience_1.deleteExperience);
profileRouter.delete("/education/:exp_id", education_1.deleteEducation);
//# sourceMappingURL=profileRoute.js.map