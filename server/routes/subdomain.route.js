import express from "express";
import { discoverSubdomains } from "../controllers/subdomain.controller.js";

const router = express.Router();

router.post("/discover-subdomain", discoverSubdomains);

export default router;
