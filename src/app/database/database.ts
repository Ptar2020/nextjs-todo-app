import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectURI = process.env.connectURI;
let isConnected = false;

const dbConnect = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB already connected");
    return;
  }
  try {
    await mongoose.connect(connectURI);
    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("DB connection error :", error.message);
  }
};

export { dbConnect };
