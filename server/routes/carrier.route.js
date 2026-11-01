import express from "express";
import { carrierLookup } from "../controllers/carrier.controller.js";

const router = express.Router();

router.post("/check-carrier", carrierLookup);

export default router;
