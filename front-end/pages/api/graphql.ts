import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";

import typeDefs from "../../graphql/typeDefs";
import resolvers from "../../graphql/resolvers";
import { GraphQLContext } from "../../utils/types";
import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer<GraphQLContext>({
  schema,
  csrfPrevention: true,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res): Promise<GraphQLContext> => {
    const session = await getSession({ req });

    return { session, prisma };
  },
});
