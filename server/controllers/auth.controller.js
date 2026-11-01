import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const SESSION_DURATION = "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: COOKIE_MAX_AGE,
  path: "/",
});

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const publicUser = (user) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueSession = (user, res) => {
  const token = jwt.sign({ userId: user._id.toString() }, getJwtSecret(), {
    expiresIn: SESSION_DURATION,
  });
  res.cookie("token", token, cookieOptions());
};

const clearSession = (res) => {
  const { maxAge, ...options } = cookieOptions();
  res.clearCookie("token", options);
};

export const register = async (req, res) => {
  try {
    getJwtSecret();
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (name.length > 50) {
      return res.status(400).json({ error: "Name must be 50 characters or fewer" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    issueSession(user, res);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    console.error("Registration failed:", error.message);
    return res.status(500).json({ error: "Unable to create account" });
  }
};

export const login = async (req, res) => {
  try {
    getJwtSecret();
    const body = req.body || {};
    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";
    const password =
      typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();
    issueSession(user, res);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ error: "Unable to sign in" });
  }
};

export const getSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      clearSession(res);
      return res.status(401).json({ error: "Account no longer exists" });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Session lookup failed:", error.message);
    return res.status(500).json({ error: "Unable to verify session" });
  }
};

export const logout = (_req, res) => {
  clearSession(res);
  return res.json({ success: true });
};
