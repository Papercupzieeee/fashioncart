import express from "express";
import { getAdminProfile, loginAdmin } from "./admin.controller.js";
import { adminAuthMiddleware } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", adminAuthMiddleware, getAdminProfile);

export default router;
