import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    seatsUsed: { type: Number, default: 1 },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
    inviteCode: { type: String, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);
