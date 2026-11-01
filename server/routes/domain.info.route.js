import express from "express";
import { getDomainInfo } from "../controllers/domain.info.controller.js";

const router = express.Router();

router.post("/domain-info", getDomainInfo);

export default router;
