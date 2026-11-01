import express from "express";
import { getUserData } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/data", getUserData);

export default router;
