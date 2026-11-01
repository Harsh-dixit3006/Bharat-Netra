import express from "express";
import { validateEmail } from "../controllers/email.validator.controller.js";

const router = express.Router();

router.post("/validate-email", validateEmail);

export default router;
