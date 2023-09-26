const express = require("express");
const { connectToDatabase, closeDatabaseConnection, db } = require("./database");
const { ObjectId } = require("mongodb");
const cors = require("cors");
const TravelDestination = require("./models/TravelDestination");

const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const notDeletedFilter = {
  $or: [
    { deleted: { $exists: false } }, // Documents where the "deleted" field does not exist
    { deleted: false }, // Documents where the "deleted" field is explicitly set to false
  ],
};

// get all travel destinations
app.get("/travel-destinations", async (req, res) => {
  try {
    const foundDestinations = await TravelDestination.find(notDeletedFilter);
    res.status(200).json(foundDestinations);
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

// get a specific travel destination
app.get("/travel-destinations/:id", async (req, res) => {
  try {
    const foundDestination = await TravelDestination.findById(req.params.id).where(notDeletedFilter);
    if (foundDestination) {
      res.status(200).json(foundDestination);
    } else {
      res.status(404).json({ error: "No document matched the query" });
    }
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

// create a travel destination
app.post("/travel-destinations", async (req, res) => {
  try {
    if (!req.body.title || !req.body.country) {
      res.status(400).json({ error: "Missing required fields" });
    } else {
      const newDestination = new TravelDestination(req.body);
      const result = await newDestination.save();
      res.status(201).json(result);
    }
  } catch (error) {
    console.error("Error adding document", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

// update a specific travel destination
app.put("/travel-destinations/:id", async (req, res) => {
  const filter = { _id: new ObjectId(req.params.id) };
  try {
    const foundDestination = await TravelDestination.findById(req.params.id).where(notDeletedFilter);
    const updatedDestination = { ...foundDestination.toObject(), ...req.body };
    const result = await TravelDestination.replaceOne(filter, updatedDestination);

    // FIXME: improve success condition ???
    if (result.modifiedCount === 1) {
      res.status(200).json(updatedDestination);
    } else if (result.matchedCount === 0) {
      res.status(404).json({ error: "No document matched the query, so no update occured" });
    } else {
      res.status(200).json({ response: "Update did not occur or had no effect" });
    }
  } catch (error) {
    console.error("Error updating document", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

// delete a specific travel destination
app.delete("/travel-destinations/:id", async (req, res) => {
  const filter = { _id: new ObjectId(req.params.id) };
  const update = { $set: { deleted: true } };
  try {
    const result = await TravelDestination.updateOne(filter, update);
    if (result.modifiedCount === 1) {
      res.status(200).json({ deletedId: req.params.id });
    } else if (result.matchedCount === 0) {
      res.status(404).json({ error: "No document matched the query, so no deletion occured" });
    } else {
      res.status(200).json({ deletedId: req.params.id });
    }
  } catch (error) {
    console.error("Error deleting document", error);
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
