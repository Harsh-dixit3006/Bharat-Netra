import axios from "axios";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

import { resolve4, resolve6, resolveMx } from "node:dns/promises";

const isValidEmailFormat = (email) => {
  if (email.length > 254) return false;

  const [local, domain, ...extra] = email.split("@");
  if (!local || !domain || extra.length || local.length > 64) return false;
  if (!/^[^\s.](?:[^\s]*[^\s.])?$/.test(local) || local.includes("..")) {
    return false;
  }

  const labels = domain.split(".");
  return (
    labels.length > 1 &&
    labels.every(
      (label) =>
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-z\d](?:[a-z\d-]*[a-z\d])?$/i.test(label),
    )
  );
};

const hasMailServer = async (domain) => {
  try {
    return (await resolveMx(domain)).length > 0;
  } catch (error) {
    if (!["ENODATA", "ENOTFOUND"].includes(error.code)) throw error;

    const addressResults = await Promise.allSettled([
      resolve4(domain),
      resolve6(domain),
    ]);
    const hasAddressRecord = addressResults.some(
      (result) => result.status === "fulfilled" && result.value.length > 0,
    );
    const lookupError = addressResults.find(
      (result) =>
        result.status === "rejected" &&
        !["ENODATA", "ENOTFOUND"].includes(result.reason.code),
    );

    if (lookupError) throw lookupError.reason;
    return hasAddressRecord;
  }
};

export const validateEmail = async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";

  if (!email) {
    return res.status(400).json({
      status: "invalid",
      reason: "email_not_given",
      message: "Email is required",
    });
  }

  if (!isValidEmailFormat(email)) {
    return res.json({
      status: "invalid",
      email,
      validation_source: "local",
      is_valid_format: false,
      is_valid_mx_records: false,
      is_valid_smtp: null,
      is_free_email: null,
      is_disposable_email: null,
      is_role_email: null,
      is_catchall_email: null,
      suggestion: null,
      message: "The email address format is invalid.",
    });
  }

  const apiKey = process.env.ABSTRACT_API_KEY;
  if (!apiKey) {
    try {
      const domain = email.slice(email.lastIndexOf("@") + 1);
      const hasMailRecords = await hasMailServer(domain);
      return res.json({
        status: "success",
        email,
        validation_source: "local",
        is_valid_format: true,
        is_free_email: null,
        is_disposable_email: null,
        is_role_email: null,
        is_catchall_email: null,
        is_valid_mx_records: hasMailRecords,
        is_valid_smtp: null,
        suggestion: null,
        message: hasMailRecords
          ? "Format and mail-domain records look valid. Mailbox existence was not checked."
          : "The format is valid, but no mail-domain records were found. Mailbox existence was not checked.",
      });
    } catch (error) {
      console.error("Local email domain lookup error:", error.message);
      return res.status(502).json({
        status: "error",
        reason: "dns_lookup_failed",
        message: "Could not check the email domain records. Please try again.",
      });
    }
  }

  try {
    const response = await axios.get(
      "https://emailvalidation.abstractapi.com/v1/",
      { params: { api_key: apiKey, email: email.trim() } }
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
      validation_source: "abstract",
      raw: data,
    });
  } catch (error) {
    console.error("Abstract API email validation error:", error.message);
    return res.status(502).json({
      status: "error",
      reason: "api_error",
      message: "The email validation provider could not complete the request. Check the server API key and try again.",
    });
  }
};
