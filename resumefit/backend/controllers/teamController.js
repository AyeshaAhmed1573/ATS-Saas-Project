import Organization from "../models/Organization.js";
import User from "../models/User.js";

export const getTeam = async (req, res) => {
  const org = await Organization.findById(req.user.organization);
  const members = await User.find({ organization: req.user.organization }).select("-password");
  res.json({ organization: org, members });
};

export const removeMember = async (req, res) => {
  if (req.user.role !== "owner" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Only owners or admins can remove members" });
  }
  const member = await User.findOneAndDelete({
    _id: req.params.userId,
    organization: req.user.organization,
  });
  if (!member) return res.status(404).json({ message: "Member not found" });

  const org = await Organization.findById(req.user.organization);
  org.seatsUsed = Math.max(1, org.seatsUsed - 1);
  await org.save();

  res.json({ message: "Member removed" });
};
