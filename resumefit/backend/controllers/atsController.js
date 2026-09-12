import Resume from "../models/Resume.js";
import { scoreResumeAgainstJob } from "../utils/atsScorer.js";

export const scoreResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: "resumeId and jobDescription are required" });
    }

    const resume = await Resume.findOne({ _id: resumeId, owner: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = scoreResumeAgainstJob(resume.rawText, jobDescription);

    resume.lastScore = {
      ...result,
      scoredAgainst: jobDescription.slice(0, 500),
      scoredAt: new Date(),
    };
    await resume.save();

    res.json({ resumeId: resume._id, ...result });
  } catch (err) {
    res.status(500).json({ message: "Scoring failed", error: err.message });
  }
};
