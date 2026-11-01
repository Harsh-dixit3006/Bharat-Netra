import { updateWeekData } from "../utils/ApiAndToolsData.js";
export const macAddressLookup = async (req, res) => {
  const API_KEY = process.env.MAC_API_KEY;
  const { macAddress } = req.body;

  if (!macAddress) {
    return res.json({
      success: false,
      message: "MAC address is required",
    });
  }

  const macRegex =
    /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9A-Fa-f]{12})$/;
  if (!macRegex.test(macAddress)) {
    return res.json({
      success: false,
      message: "Invalid MAC address format",
    });
  }

  try {
    const response = await fetch(
      `https://api.macaddress.io/v1?apiKey=${API_KEY}&output=json&search=${macAddress}`,
    );

    await updateWeekData(req.userId, "MAC Address Lookup");

    if (!response.ok) {
      return res.json({
        success: false,
        message: "Failed to fetch from macaddress.io API",
      });
    }
    const data = await response.json();
    if (data.vendorDetails.oui === "") {
      return res.json({
        success: true,
        mac: macAddress,
        result: "No Record found",
      });
    }
    return res.json({
      success: true,
      mac: macAddress,
      vendorDetails: data.vendorDetails || null,
    });
  } catch (error) {
    console.error("Error fetching MAC vendor info:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
