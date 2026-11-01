// controllers/analyzeController.js
import asyncHandler from "express-async-handler";
import {
  parseHeader,
  getSendingIPs,
  checkSPF,
  checkDMARC,
} from "../utils/headerParser.js";

// POST /api/analyze
export const analyzeHeader = asyncHandler(async (req, res) => {
  const { rawHeader } = req.body;

  if (!rawHeader) {
    res.status(400);
    throw new Error("rawHeader is required");
  }

  // 1) Parse header
  const parsed = await parseHeader(rawHeader);

  // 2) Extract sending IPs
  const sendingIPs = getSendingIPs(parsed.received || []);

  // 3) Extract domain from From header
  const from = parsed.headers?.from?.text || parsed.headers?.from || null;
  let fromDomain = null;

  if (from) {
    const match = from.match(/@([\w.-]+)/);
    if (match) fromDomain = match[1];
  }

  // 4) SPF & DMARC checks
  const spf = fromDomain ? await checkSPF(fromDomain) : { found: false };
  const dmarc = fromDomain ? await checkDMARC(fromDomain) : { found: false };

  // 5) Final result
  const result = {
    sendingIPs,
    fromDomain,
    spf,
    dmarc,
    headersPreview: parsed.headers,
    received: parsed.received,
  };

  res.json({ result });
});
