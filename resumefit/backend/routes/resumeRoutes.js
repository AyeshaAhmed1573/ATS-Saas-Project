import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  uploadResume,
} from "../controllers/resumeController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.use(protect);
router.get("/", listResumes);
router.post("/", createResume);
router.post("/upload", upload.single("file"), uploadResume);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;
