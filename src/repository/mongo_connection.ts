import mongoose from "mongoose";
import config from "@src/config";
import { MongoClient } from "mongodb";
export default function connectToDatabase(): Promise<MongoClient | undefined> {
  return new Promise((resolve, reject) => {
    console.log("Connecting to MongoDB...");

    mongoose
      .connect(config.mongo.URL as string)
      .then(() => {
        console.log("Connected successfully to MongoDB");
        const client = mongoose.connection.getClient() as MongoClient;
        resolve(client);
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        reject(error);
      });
  });
}
