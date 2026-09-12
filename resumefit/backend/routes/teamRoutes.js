import express from "express";
import { protect } from "../middleware/auth.js";
import { getTeam, removeMember } from "../controllers/teamController.js";

const router = express.Router();
router.use(protect);
router.get("/", getTeam);
router.delete("/:userId", removeMember);

export default router;
