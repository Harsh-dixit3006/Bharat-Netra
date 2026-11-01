import axios from "axios";

// 🔹 Fetch IP history for a domain using SecurityTrails API only
export const getIPHistory = async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: "Domain is required" });
  }

  try {
    const response = await axios.get(
      `https://api.securitytrails.com/v1/history/${domain}/dns/a`,
      {
        headers: { APIKEY: process.env.SECURITYTRAILS_API_KEY },
      }
    );

    if (!response.data || !response.data.records) {
      return res.status(404).json({ error: "No IP history found" });
    }

    const records = response.data.records.map((rec) => ({
      ip: rec.values?.[0]?.ip || "N/A",
      firstSeen: rec.first_seen || "N/A",
      lastSeen: rec.last_seen || "N/A",
    }));

    return res.json({ domain, records });
  } catch (error) {
    console.error(
      "❌ IP History Error:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: error.response?.data?.message || "Failed to fetch IP history",
    });
  }
};

// 🔹 Reverse IP lookup using SecurityTrails API only
export const reverseIPLookup = async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  try {
    const response = await axios.get(
      `https://api.securitytrails.com/v1/ips/nearby/${ip}`,
      { headers: { APIKEY: process.env.SECURITYTRAILS_API_KEY } }
    );

    const records = response.data?.records || [];

    return res.json({
      ip,
      hosts: records.map((r) => ({
        ip: r.ip || "N/A",
        hostname: r.hostname || r.host || "N/A",
      })),
      geo: null,
      ptr: [],
      rdap: null,
      whois: null,
    });
  } catch (error) {
    console.error(
      "❌ Reverse IP Error:",
      error.response?.data || error.message
    );

    return res.json({
      ip,
      hosts: [],
      geo: null,
      ptr: [],
      rdap: null,
      whois: null,
      error: error.response?.data?.message || "No data found",
    });
  }
};
