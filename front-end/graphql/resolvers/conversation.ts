import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { ConversationPopulated, GraphQLContext } from "../../utils/types";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      contextvalue: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = contextvalue;

      if (!session) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;
      console.log("userId", userId);

      try {
        //  Find all conversations that user is part of
        const conversations = await prisma.conversation.findMany({
          // where: {
          //   participants: {
          //     some: {
          //       userId: {
          //         equals: userId,
          //       },
          //     },
          //   },
          // },
          include: conversationPopulated,
        });

        // Since above query does not work
        const myConversations = conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
        // console.log("myConversations", myConversations);

        return myConversations;
      } catch (error: any) {
        console.log("coversation error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      contextValue: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, session } = contextValue;
      const { participantIds } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const { id: userId } = session.user;

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log("Error creating conversation", error);
        throw new GraphQLError("Error creating conversation");
      }
    },
  },
};

// include statements
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
