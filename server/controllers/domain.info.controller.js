import whois from "whois";
import { updateWeekData } from "../utils/ApiAndToolsData.js";

export const getDomainInfo = async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) {
      return res.json({ success: false, message: "Domain is required" });
    }

    await updateWeekData(req.userId, "WHOIS Lookup");

    whois.lookup(domain, (err, data) => {
      data = formatData({ whoisData: data });
      if (err) return res.json({ success: false, error: err.message });
      res.json({ success: true, domain, data });
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

function formatData({ whoisData }) {
  const formattedData = {};
  whoisData?.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) {
      const value = rest.join(":").trim();
      if (formattedData[key]) {
        if (Array.isArray(formattedData[key])) {
          formattedData[key].push(value);
        } else {
          formattedData[key] = [formattedData[key], value];
        }
      } else {
        formattedData[key] = value;
      }
    }
  });
  return formattedData;
}
