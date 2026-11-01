// routes/analyzeRoutes.js
import express from "express";
import { analyzeHeader } from "../controllers/emailHeaderAnalyzer.controller.js";

const emailHeaderRouter = express.Router();

emailHeaderRouter.post("/analyse-header", analyzeHeader);

export default emailHeaderRouter;
