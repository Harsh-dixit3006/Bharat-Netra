import express from "express";
import { macAddressLookup } from "../controllers/macAddress.lookup.controller.js";

const router = express.Router();

router.post("/macAdd-lookup", macAddressLookup);

export default router;
