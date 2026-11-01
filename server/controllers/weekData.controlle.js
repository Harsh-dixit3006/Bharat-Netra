import { getWeekData } from "../utils/ApiAndToolsData.js";

export const fetchWeekData = async (req, res) => {
  try {
    const weekData = await getWeekData(req.userId);
    return res.json({
      success: true,
      apiData: weekData,
    });
  } catch (error) {
    console.error(
      "Error while fetching Week Data:: weekData Controller:: ",
      error.message,
    );
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly data",
    });
  }
};
