import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { createGraphQLServer } from "./graphql/index.js";
import cors from "cors";
import { db } from "./lib/db.js";

process.loadEnvFile();

async function start() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Specify the path where we'd like to mount our server
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(await createGraphQLServer()), ////create graphQL server from the componenets in graphql/index.ts
  );

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running!" });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
