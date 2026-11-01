import axios from "axios";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

export const validateEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      status: "invalid",
      reason: "email_not_given",
      message: "Email is required",
    });
  }

  try {
    const apiKey = process.env.ABSTRACT_API_KEY;
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(
        email
      )}`
    );

    const data = response.data;

    return res.json({
      status: "success",
      email: data.email,
      is_valid_format: data.is_valid_format?.value || false,
      is_free_email: data.is_free_email?.value || false,
      is_disposable_email: data.is_disposable_email?.value || false,
      is_role_email: data.is_role_email?.value || false,
      is_catchall_email: data.is_catchall_email?.value || false,
      is_valid_mx_records: data.is_valid_mx_records?.value || false,
      is_valid_smtp: data.is_valid_smtp?.value || false,
      suggestion: data.did_you_mean || null,
      raw: data,
    });
  } catch (error) {
    console.error("Abstract API email validation error:", error.message);
    return res.status(500).json({
      status: "error",
      reason: "api_error",
      message: "Failed to validate email via Abstract API",
      error: error.message,
    });
  }
};
