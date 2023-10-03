const router = require("express").Router();

const TravelDestination = require("../models/TravelDestination");
const validateToken = require("../middlewares/validateToken");

const notDeletedFilter = {
  $or: [
    { deleted: { $exists: false } }, // Documents where the "deleted" field does not exist
    { deleted: false }, // Documents where the "deleted" field is explicitly set to false
  ],
};

// get all travel destinations
router.get("/", async (req, res) => {
  try {
    const foundDestinations = await TravelDestination.find(notDeletedFilter);
    res.status(200).json(foundDestinations);
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

// get a specific travel destination
router.get("/:id", async (req, res) => {
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
router.post("/", async (req, res) => {
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
router.put("/:id", async (req, res) => {
  try {
    const foundDestination = await TravelDestination.findById(req.params.id).where(notDeletedFilter);
    const updatedDestination = { ...foundDestination.toObject(), ...req.body };
    const result = await TravelDestination.findByIdAndUpdate(req.params.id, updatedDestination);

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
router.delete("/:id", validateToken, async (req, res) => {
  const update = { $set: { deleted: true } };
  try {
    const result = await TravelDestination.findByIdAndUpdate(req.params.id, update);
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

module.exports = router;
