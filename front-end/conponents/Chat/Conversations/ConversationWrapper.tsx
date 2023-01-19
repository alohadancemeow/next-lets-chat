import React, { useEffect } from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  ConversationsData,
  ConversationCreatedSubscriptionData,
} from "../../../utils/types";

type Props = {
  session: Session;
};

const ConversationWrapper = ({ session }: Props) => {
  const router = useRouter();
  const { conversationId } = router.query;

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

  // View conversation
  const onViewConversation = async (conversationId: string) => {
    // 1. push the conversationId to the router query params
    router.push({ query: { conversationId } });
    // 2. mark the conversation as read
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
      py={6}
      px={3}
      position="relative"
    >
      {conversationLoading ? (
        <>Loading...</>
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
