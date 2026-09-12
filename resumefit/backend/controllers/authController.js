import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Organization from "../models/Organization.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, organizationName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const org = await Organization.create({
      name: organizationName || `${name}'s Workspace`,
      inviteCode: crypto.randomBytes(4).toString("hex"),
    });

    const user = await User.create({
      name,
      email,
      password,
      role: "owner",
      organization: org._id,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject(), organization: org });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const getMe = async (req, res) => {
  const org = await Organization.findById(req.user.organization);
  res.json({ user: req.user.toSafeObject(), organization: org });
};

export const joinOrganization = async (req, res) => {
  try {
    const { inviteCode, name, email, password } = req.body;
    const org = await Organization.findOne({ inviteCode });
    if (!org) return res.status(404).json({ message: "Invalid invite code" });

    const user = await User.create({
      name,
      email,
      password,
      role: "member",
      organization: org._id,
    });
    org.seatsUsed += 1;
    await org.save();

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toSafeObject(), organization: org });
  } catch (err) {
    res.status(500).json({ message: "Could not join organization", error: err.message });
  }
};
