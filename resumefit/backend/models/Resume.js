import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
    title: { type: String, required: true, default: "Untitled Resume" },
    rawText: { type: String, default: "" },
    fileName: { type: String, default: null },
    fileType: { type: String, default: null },
    lastScore: {
      matchPercent: { type: Number, default: null },
      matchedKeywords: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      scoredAgainst: { type: String, default: null },
      scoredAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
