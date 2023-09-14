const app = require("express")();
const { connectToDatabase, closeDatabaseConnection, db } = require("./database");
const port = 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const destinations = await db.collection("destinations").find().toArray();
    res.status(200).json({ destinations });
  } catch (error) {
    console.error("Error reading collection", error);
    res.status(500).json({ error: "Internal server error occured" });
  }
});

app.post("/", async (req, res) => {
  try {
    if (!req.body.title || !req.body.country || !req.body.link) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    } else {
      const newDestination = req.body;
      const result = await db.collection("destinations").insertOne(newDestination);
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
