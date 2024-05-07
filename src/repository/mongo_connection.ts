import mongoose from "mongoose";
import config from "@src/config";
const connection = { state: 0 };
export default async function connectToDatabase() {
  try {
    if (connection.state == 0) {
      console.log("Connecting to MongoDB...");
      const dbConnectionResult = await mongoose.connect(
        config.mongo.URL as string
      );
      connection.state = dbConnectionResult.connections[0].readyState;
      console.log("Connected successfully to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
