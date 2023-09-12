const app = require("express")();
const port = 3000;
const { connectToDatabase, closeDatabaseConnection, db } = require("./database");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const cities = await db.collection("cities").find().toArray();
    res.status(200).json({ cities });
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

app.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.country || !req.body.description || req.body.rating === undefined) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const newDestination = {
        name: req.body.name,
        country: req.body.country,
        description: req.body.description,
        rating: req.body.rating,
      };
      const result = await db.collection("cities").insertOne(newDestination);
      res.status(201).json({ message: "Document added sucessfully", insertedId: result.insertedId });
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
