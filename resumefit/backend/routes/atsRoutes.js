import express from "express";
import { protect } from "../middleware/auth.js";
import { scoreResume } from "../controllers/atsController.js";

const router = express.Router();
router.post("/score", protect, scoreResume);

export default router;
