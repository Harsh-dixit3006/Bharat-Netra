import express from "express";
import { scanPorts } from "../controllers/portScanner.controller.js";

const router = express.Router();

router.post("/scan-ports", scanPorts);

export default router;
