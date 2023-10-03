const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { connectToDatabase, closeDatabaseConnection } = require("./database");
const travelDestinationsRouter = require("./routers/travelDestinations");
const authRouter = require("./routers/auth");

const app = express();
dotenv.config();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/travel-destinations", travelDestinationsRouter);

connectToDatabase()
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch((error) => console.error("Error starting the server", error));

process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  console.log("Server is shutting down");
  process.exit(0);
});
