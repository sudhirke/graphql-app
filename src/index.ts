import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { createGraphQLServer } from "./graphql/index.js";
import cors from "cors";
import { db } from "./lib/db.js";
import UserServices from "./services/user.services.js";

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
    expressMiddleware(await createGraphQLServer(), {
      context: async ({ req }) => {
        const token = req.headers["token"]?.toString() || "";
        //console.log("Token from request headers:", token);

        try {
          const user = UserServices.verifyUserToken(token as string);
          return { user };
        } catch (error) {
          throw new Error("Invalid token");
        }
      },
    }),
    ////create graphQL server from the componenets in graphql/index.ts
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
