const express = require("express");
const { connectToDatabase, closeDatabaseConnection, db } = require("./database");
const { ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

app.get("/travel-destinations", async (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  try {
    const destinations = await db.collection("destinations").find().toArray();
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

app.post("/travel-destination", async (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  try {
    if (!req.body.title || !req.body.country) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const newDestination = req.body;
      const result = await db.collection("destinations").insertOne(newDestination);
      const foundDestination = await db.collection("destinations").findOne({ _id: new ObjectId(result.insertedId) });
      res.status(201).json(foundDestination);
    }
  } catch (error) {
    console.error("Error adding document", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

connectToDatabase()
  .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
  .catch((error) => console.error("Error starting the server", error));

process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  console.log("Server is shutting down");
  process.exit(0);
});
