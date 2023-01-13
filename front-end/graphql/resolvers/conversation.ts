import { GraphQLContext } from "../../utils/types";

const resolvers = {
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantsIds: Array<string> },
      contextValue: GraphQLContext
    ) => {
      console.log("INSIDE CREATE  CONVERSATION", args);
    },
  },
};

export default resolvers;
