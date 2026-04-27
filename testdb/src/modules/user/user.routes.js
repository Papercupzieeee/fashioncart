import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfile
} from "./user.controller.js";

import { authMiddleware } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", registerUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes (authentication required)
router.get("/profile", authMiddleware, getProfile);
router.get("/all", authMiddleware, getUsers);
router.get("/id/:id", authMiddleware, getUser);
router.put("/update/:id", authMiddleware, updateUser);
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;