// controllers/carrier.controller.js
import axios from "axios";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

export const carrierLookup = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (!process.env.VERIPHONE_API_KEY) {
      return res.status(503).json({
        error: "Carrier lookup is not configured. Set VERIPHONE_API_KEY on the server.",
      });
    }

    const response = await axios.get("https://api.veriphone.io/v2/verify", {
      params: {
        phone: phone,
        key: process.env.VERIPHONE_API_KEY,
      },
    });

    await updateWeekData(req.userId, "Mobile Carrier Lookup");

    res.json({
      phone: response.data.phone,
      international: response.data.international_number,
      country: response.data.country,
      carrier: response.data.carrier,
      phone_type: response.data.phone_type,
      valid: response.data.phone_valid,
    });
  } catch (error) {
    console.error("Carrier Lookup Error:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data || "API Error",
      });
    }

    res.status(500).json({ error: "Server error" });
  }
};
