import React, { cache, useEffect } from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import { gql, useMutation, useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  ConversationsData,
  ConversationCreatedSubscriptionData,
  ParticipantPopulated,
} from "../../../utils/types";
import SkeletonLoader from "../../common/SkeletonLoader";

type Props = {
  session: Session;
};

const ConversationWrapper = ({ session }: Props) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const { id: userId } = session.user;

  // Call conversation query
  const {
    data: conversationData,
    loading: conversationLoading,
    error: conversationError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations,
    {
      onError: ({ message }) => {
        toast.error(message);
      },
      onCompleted: ({ conversations }) => {
        console.log("onComplete", conversations);
      },
    }
  );

  // Call markConversatioAsRead mutation
  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  // Handle onViewConversation
  const onViewConversation = async (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => {
    // 1. push the conversationId to the router query params
    router.push({ query: { conversationId } });
    // 2. mark the conversation as read
    if (hasSeenLastestMessage) return;

    // markConversationAsRead mutation
    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          /**
           * Get conversation participants from cache
           */
          const participantsFragment = cache.readFragment<{
            participants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          /**
           * Update participant to show latest message as read
           */
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdateParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      console.log("onViewConversation error", error);
    }
  };

  /**
   * subscribes to a new conversation
   * and updates the query with the new conversation.
   */
  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData }: ConversationCreatedSubscriptionData
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  // Execute subscription on mount
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  if (conversationError) {
    toast.error("There was an error fetching conversations");
    return null;
  }

  return (
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
      flexDirection={"column"}
      py={6}
      px={3}
      gap={4}
      position="relative"
    >
      {conversationLoading ? (
        <SkeletonLoader
          // count={conversationData?.conversations.length as number}
          count={5}
          height="80px"
        />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationWrapper;
