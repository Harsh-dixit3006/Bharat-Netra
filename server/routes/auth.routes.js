import express from "express";
import { getSession, login, logout, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, getSession);

export default router;
