import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createCheckoutSession,
  stripeWebhook,
  getBillingStatus,
} from "../controllers/billingController.js";

const router = express.Router();

// Note: the raw body parser for this route is applied globally in server.js
// (Stripe webhooks need the raw, unparsed body to verify signatures).
router.post("/webhook", stripeWebhook);
router.use(protect);
router.get("/status", getBillingStatus);
router.post("/checkout", createCheckoutSession);

export default router;
