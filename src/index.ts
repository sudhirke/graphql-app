import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import { db } from "./lib/db.js";
import { randomBytes } from "node:crypto";

process.loadEnvFile();

async function start() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  //create graphQL server by passing TypeDefs and Resolvers
  const gqlServer = new ApolloServer({
    typeDefs: `
      type Query {
        hello: String
        sayMyName(name:String): String
        users: [User!]!
      }

      type User {
        id: Int!
        email: String!
        name: String
      }
      
      type Mutation{
      createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
      }
      `, //schema
    resolvers: {
      Query: {
        hello: () => "Hello World, GraphQL Server!",
        sayMyName: (parent, { name }: { name: String }) =>
          `Hey ${name}, how are you today?`,
        users: () =>
          db.orm.public.User.select("id", "email", "firstName", "lastName")
            .orderBy((user) => user.id.asc())
            .all(),
      },
      Mutation: {
        createUser: async ({
          firstName,
          lastName,
          email,
          password,
        }: {
          firstName: string;
          lastName: string;
          email: string;
          password: string;
        }) => {
          //Create new user
          const user = await db.orm.public.User.create({
            firstName,
            lastName,
            email,
            password,
            profileImageURL: "www.spxert.in",
            salt: randomBytes(8).toHex(),
          });
          return true;

          // const user = await db.orm.public.User.where({
          //   email: "alice@example.com",
          // }).first();
        },
      },
    }, //resolver functions
  });

  app.use(express.json());

  //start graphQL server
  await gqlServer.start();

  // Specify the path where we'd like to mount our server
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(gqlServer),
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
