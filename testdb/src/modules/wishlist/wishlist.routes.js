import express from "express";
import { toggleWishlist, getWishlist } from "./wishlist.controller.js";

const router = express.Router();

router.post("/toggle", toggleWishlist);
router.get("/:userId", getWishlist);

export default router;