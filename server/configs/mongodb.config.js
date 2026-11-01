import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not configured");
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log("Database Connected Successfully ✅");
  } catch (error) {
    console.error(
      "Database Connection Failed ❌",
      error.name,
      error.code ? `(code ${error.code})` : "",
    );
    throw error;
  }
};

export default connectDB;
