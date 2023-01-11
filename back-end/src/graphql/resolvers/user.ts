import { CreateUsernameResponse, GraphQLContext } from "../../../utils/types";

// User resolvers
const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      contextValue: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = contextValue;

      console.log("At resolvers", username);
      console.log("At resolvers context", session);

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      // const { name } = session.user;

      try {
        const existingUser = await prisma.user;
      } catch (error) {
        console.log("createUsername error", error);
        return { error: error?.message };
      }
    },
  },
  //   Subsription: () => {},
};

export default resolvers;
