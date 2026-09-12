import fs from "fs";
import Resume from "../models/Resume.js";
import { extractTextFromFile } from "../utils/textExtractor.js";

export const listResumes = async (req, res) => {
  const resumes = await Resume.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
};

export const getResume = async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, owner: req.user._id });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};

export const createResume = async (req, res) => {
  const { title, rawText } = req.body;
  const resume = await Resume.create({
    owner: req.user._id,
    organization: req.user.organization,
    title: title || "Untitled Resume",
    rawText: rawText || "",
  });
  res.status(201).json(resume);
};

export const updateResume = async (req, res) => {
  const { title, rawText } = req.body;
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { ...(title !== undefined && { title }), ...(rawText !== undefined && { rawText }) },
    { new: true }
  );
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};

export const deleteResume = async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json({ message: "Resume deleted" });
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const text = await extractTextFromFile(req.file.path, req.file.mimetype);

    const resume = await Resume.create({
      owner: req.user._id,
      organization: req.user.organization,
      title: req.file.originalname,
      rawText: text,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });

    fs.unlink(req.file.path, () => {});
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: "Could not process file", error: err.message });
  }
};
