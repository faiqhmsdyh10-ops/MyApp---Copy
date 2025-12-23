import express from "express";
import {
  createQrisPayment,
  createSnapPayment,
  checkPaymentStatus,
  handleWebhook,
  cancelPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create QRIS payment (Dynamic QR Code)
router.post("/create-qris", createQrisPayment);

// Create Snap payment (Popup payment page - alternative)
router.post("/create-snap", createSnapPayment);

// Check payment status
router.get("/status/:orderId", checkPaymentStatus);

// Webhook endpoint for Midtrans notifications
// Note: This endpoint should be publicly accessible for Midtrans to call
router.post("/webhook", handleWebhook);

// Cancel payment
router.post("/cancel/:orderId", cancelPayment);

export default router;
