import mongoose from "mongoose";

const weeklyDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    },
    weekStartDate: {
      type: String, // 'YYYY-MM-DD' format
      index: true,
      required: true,
    },

    dailyUsage: [
      {
        dayOfWeek: {
          type: Number, //0-Sunday 1-Monday....
          required: true,
          min: 0,
          max: 6,
        },
        date: {
          type: String, // 'YYYY-MM-DD'
          required: true,
        },
        totalApiCalls: {
          type: Number,
          default: 0,
        },
        toolsUsed: [
          {
            toolName: {
              type: String,
              required: true,
            },
            apiCallsCount: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],

    weeklyTotalCalls: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

weeklyDataSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export const WeeklyData = mongoose.model("WeeklyData", weeklyDataSchema);
