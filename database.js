const mongoose = require("mongoose");

const mongoUrl = "mongodb://127.0.0.1:27017/travel-destinations";

mongoose.set("debug", true);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
    mongoose.connection.on("error", () => {
      throw new Error("MongoDB error");
    });
  } catch (error) {
    console.error(error);
  }
  mongoose.connection.once("open", () => console.log("Connected to MongoDB open"));
};

const closeDatabaseConnection = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
  }
};

const db = mongoose.connection;

module.exports = { connectToDatabase, closeDatabaseConnection, db };
