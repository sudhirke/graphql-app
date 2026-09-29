const express = require("express");
const process = require("node:process");

process.loadEnvFile();

const db = require("./lib/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h2>GraphQL-Backend Server</h2>");
});

async function start() {
  await db.query("SELECT 1");
  console.log("Database connection verified");

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
