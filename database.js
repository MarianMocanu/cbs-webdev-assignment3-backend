const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/travel-destinations";
const client = new MongoClient(uri);

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

const closeDatabaseConnection = async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
  }
};

const db = client.db();

module.exports = { connectToDatabase, closeDatabaseConnection, db  };
