import express from "express";
import {
  addToCart,
  getCart,
  decreaseCart,
  removeCart,
} from "./cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/decrease/:id", decreaseCart);
router.delete("/remove/:id", removeCart);

export default router;