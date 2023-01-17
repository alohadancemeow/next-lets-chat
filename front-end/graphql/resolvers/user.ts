import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { CreateUsernameResponse, GraphQLContext } from "../../utils/types";

// User resolvers
const resolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { username: string },
      contextValue: GraphQLContext
    ): Promise<Array<User>> => {
      const { username: searchUsername } = args;
      const { session, prisma } = contextValue;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { username: myUsername } = session.user;

      // Search username exept me (myUsername)
      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchUsername,
              not: myUsername,
              mode: "insensitive",
            },
          },
        });
        return users;
      } catch (error: any) {
        console.log("searchUser error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      contextValue: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = contextValue;

      if (!session?.user) {
        return {
          error: "Not authorized",
        };
      }

      const { id: userId } = session.user;

      try {
        // Check that username is not taken
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existingUser) {
          return {
            error: "Username already taken. Try another",
          };
        }

        // Update username
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log("createUsername error", error);
        return {
          error: error?.message,
        };
      }
    },
  },
  //   Subsription: () => {},
};

export default resolvers;
