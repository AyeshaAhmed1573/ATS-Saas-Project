import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import atsRoutes from "./routes/atsRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import billingRoutes from "./routes/billingRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// Billing webhook needs the raw body, so it's mounted before express.json()
app.use("/api/billing/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/billing", billingRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ResumeFit API running on port ${PORT}`));
