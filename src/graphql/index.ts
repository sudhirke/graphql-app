import { ApolloServer } from "@apollo/server";
import {UserQL} from "./user/index.js";

async function createGraphQLServer() 
{
  //create graphQL server by passing TypeDefs and Resolvers
  const gqlServer = new ApolloServer({
    typeDefs: `
      ${UserQL.typeDefs}

      type Query {
      ${UserQL.queries}
      }
      type Mutation {
      ${UserQL.mutations}
      }
      `, //schema
    resolvers: {
      Query: {
        ...UserQL.resolvers.queries
      },
      Mutation: 
      {
        ...UserQL.resolvers.mutations
      }
    }
});

//2. Start the Graph QL server
await gqlServer.start();

//3. Return the Graph QL server instance
return gqlServer;

}

//export the function to create GraphQL server
export { createGraphQLServer };
