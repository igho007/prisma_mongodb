"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const createPost_1 = require("./../controllers/Posts/createPost");
const express_validator_1 = require("express-validator");
const express_1 = require("express");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.post("/create-post", [(0, express_validator_1.check)("text", "Enter text").not().isEmpty()], createPost_1.createPost);
//# sourceMappingURL=postRoute.js.map