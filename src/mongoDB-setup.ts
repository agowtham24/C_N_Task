import mongoose from "mongoose";
import Config from "./config";

export class MongoDB {
  static async connectDB() {
    if (Config.DB_URL) {
      await mongoose.connect(Config.DB_URL);
      console.log("Database connected successfully");
    } else {
      throw new Error("MongoDB_url was empty");
    }
  }
  static async convertToObjectId(uuid: string) {
    return new mongoose.Types.ObjectId(uuid);
  }
}
