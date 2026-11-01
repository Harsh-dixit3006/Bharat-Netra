import express from "express";
import { lookupIP } from "../controllers/reverseip.lookup.controller.js";

const router = express.Router();

router.post("/reverse-ip-lookup", lookupIP);

export default router;
