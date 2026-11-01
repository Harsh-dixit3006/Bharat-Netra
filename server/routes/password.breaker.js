import express from "express";
import { passwordBreaker } from "../controllers/password.breaker.controller.js";

const router = express.Router();

router.post("/pass-breaker", passwordBreaker);

export default router;
