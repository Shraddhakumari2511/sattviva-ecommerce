import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updateTrackingNumber,
  createRazorpayOrder,
  cancelOrder,
  requestReturn,
  requestReplacement,
  downloadInvoice,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import adminMiddleware from "../middleware/adminMiddleware.js";



const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, getMyOrders);

router.get("/", authMiddleware, adminMiddleware, getAllOrders);

router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

router.put("/:id/tracking", authMiddleware, adminMiddleware, updateTrackingNumber);

router.post("/create-razorpay-order",authMiddleware, createRazorpayOrder);

router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

router.put(
  "/:id/return",
  authMiddleware,
  requestReturn
);

router.put(
  "/:id/replace",
  authMiddleware,
  requestReplacement
);

router.get(
  "/:id/invoice",
  authMiddleware,
  downloadInvoice
);

export default router;