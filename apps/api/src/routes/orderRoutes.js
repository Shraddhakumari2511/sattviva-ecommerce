import express from "express";

import {createOrder, getMyOrders, getAllOrders, updateOrderStatus, updateTrackingNumber, createRazorpayOrder,} from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";



const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);

router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

router.put("/:id/tracking", authMiddleware, adminMiddleware, updateTrackingNumber);

router.post("/create-razorpay-order",authMiddleware, createRazorpayOrder);

export default router;