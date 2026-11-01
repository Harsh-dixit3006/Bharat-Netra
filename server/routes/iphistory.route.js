// routes/ipHistory.routes.js
import express from "express";
import {
  getIPHistory,
  reverseIPLookup,
} from "../controllers/iphistory.controller.js";

const ipHistoryRouter = express.Router();

ipHistoryRouter.post("/ip-history", getIPHistory);
ipHistoryRouter.post("/reverse-ip-history", reverseIPLookup);

export default ipHistoryRouter;
