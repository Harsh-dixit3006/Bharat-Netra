import { getTodaysData } from "../utils/ApiAndToolsData.js";

export const fetchTodaysData = async (req, res) => {
  try {
    const todaysData = await getTodaysData(req.userId);

    return res.json({
      success: true,
      apiData: todaysData,
    });
  } catch (error) {
    console.error(
      "Error while fetching today's Data:: todaysData Controller:: ",
      error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly data",
    });
  }
};
