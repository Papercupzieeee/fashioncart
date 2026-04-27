import express from "express";
import { createOrders, getOrdersByUserId } from "./order.controller.js";

const router = express.Router();

router.post("/", createOrders);
router.get("/:userId", getOrdersByUserId);

export default router;
