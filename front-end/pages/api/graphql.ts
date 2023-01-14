import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";
import { GraphQLContext, SubscriptionContext } from "../../utils/types";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();
const pubsub = new PubSub();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const wsServer = new WebSocketServer({
  // server: httpServer,
  port: 4000,
  path: "/graphql/subscriptions",
});

// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer(
  {
    schema,
    context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
      if (ctx.connectionParams && ctx.connectionParams.session) {
        const { session } = ctx.connectionParams;
        return { session, prisma, pubsub };
      }
      return { session: null, prisma, pubsub };
    },
  },
  wsServer
);

const server = new ApolloServer<GraphQLContext>({
  schema,
  csrfPrevention: true,
  plugins: [
    // Proper shutdown for the HTTP server.
    // ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

export default startServerAndCreateNextHandler(server, {
  context: async (req): Promise<GraphQLContext> => {
    const session = await getSession({ req });

    return { session, prisma, pubsub };
  },
});
