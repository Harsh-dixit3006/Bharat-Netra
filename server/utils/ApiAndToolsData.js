import { WeeklyData } from "../models/weeklyData.model.js";

const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

const getCurrentDayOfWeek = () => {
  return new Date().getDay();
};

const getWeekStartDate = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const weekStart = new Date(d.setDate(diff));
  return weekStart.toISOString().split("T")[0];
};

const initializeDailyUsage = (weekStartDate) => {
  const dailyUsage = [];
  const startDate = new Date(weekStartDate);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    dailyUsage.push({
      dayOfWeek: i,
      date: currentDate.toISOString().split("T")[0],
      totalApiCalls: 0,
      toolsUsed: [],
    });
  }

  return dailyUsage;
};

const getTodaysData = async (userId) => {
  try {
    const currentWeekStart = getWeekStartDate();
    const todayDateString = getTodayDateString();
    const currentDayOfWeek = getCurrentDayOfWeek();

    const weeklyData = await WeeklyData.findOne({
      userId,
      weekStartDate: currentWeekStart,
    });

    if (!weeklyData) return null;

    const todayData = weeklyData.dailyUsage.find(
      (day) =>
        day.dayOfWeek === currentDayOfWeek && day.date === todayDateString,
    );

    return todayData || null;
  } catch (error) {
    console.error("Error getting today's data:", error);
    throw error;
  }
};

const getWeekData = async (userId) => {
  try {
    const currentWeekStart = getWeekStartDate();

    const weeklyData = await WeeklyData.findOne({
      userId,
      weekStartDate: currentWeekStart,
    });

    return weeklyData;
  } catch (error) {
    console.error("Error getting week data:", error);
    throw error;
  }
};

const updateWeekData = async (userId, toolName) => {
  if (!userId) return null; // Skip tracking for guests
  try {
    const currentWeekStart = getWeekStartDate();
    const todayDateString = getTodayDateString();
    const currentDayOfWeek = getCurrentDayOfWeek();

    // Find or create current week's data
    let weeklyData = await WeeklyData.findOne({
      userId,
      weekStartDate: currentWeekStart,
    });

    if (!weeklyData) {
      weeklyData = new WeeklyData({
        userId,
        weekStartDate: currentWeekStart,
        dailyUsage: initializeDailyUsage(currentWeekStart),
        weeklyTotalCalls: 0,
      });
    }

    const todayIndex = weeklyData.dailyUsage.findIndex(
      (day) =>
        day.dayOfWeek === currentDayOfWeek && day.date === todayDateString,
    );

    if (todayIndex === -1) {
      throw new Error("Today not found in weekly usage array");
    }

    const todayUsage = weeklyData.dailyUsage[todayIndex];
    todayUsage.totalApiCalls += 1;

    const toolIndex = todayUsage.toolsUsed.findIndex(
      (tool) => tool.toolName === toolName,
    );

    if (toolIndex >= 0) {
      todayUsage.toolsUsed[toolIndex].apiCallsCount += 1;
    } else {
      todayUsage.toolsUsed.push({
        toolName,
        apiCallsCount: 1,
      });
    }

    weeklyData.weeklyTotalCalls += 1;

    await weeklyData.save();
    return weeklyData;
  } catch (error) {
    console.error("Error updating week data:", error);
    throw error;
  }
};

const getDayData = async (userId, dayOfWeek) => {
  try {
    const weeklyData = await getWeekData(userId);

    if (!weeklyData) return null;

    return weeklyData.dailyUsage.find((day) => day.dayOfWeek === dayOfWeek);
  } catch (error) {
    console.error("Error getting day data:", error);
    throw error;
  }
};

export {
  getTodaysData,
  getWeekData,
  updateWeekData,
  getDayData,
  getTodayDateString,
  getCurrentDayOfWeek,
  getWeekStartDate,
};
