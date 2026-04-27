import express from "express";
import multer from "multer"; // Requires: npm install multer
import path from "path";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  updateDiscount
} from "./product.controller.js";

import { authMiddleware } from "../../shared/middleware/auth.middleware.js";
import { isAdmin } from "../../shared/middleware/role.middleware.js";

const router = express.Router();

// Configuration for Image Uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/:id", getProduct);

// Added upload.single("image") to parse multipart data correctly
router.post("/", authMiddleware, isAdmin, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.patch("/:id/stock", authMiddleware, isAdmin, updateStock);
router.patch("/:id/discount", authMiddleware, isAdmin, updateDiscount);

export default router;
