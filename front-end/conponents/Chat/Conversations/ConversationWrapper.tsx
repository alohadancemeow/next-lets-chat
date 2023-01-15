import React, { useEffect } from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationPopulated, ConversationsData } from "../../../utils/types";

type Props = {
  session: Session;
};

const ConversationWrapper = ({ session }: Props) => {
  const {
    data: conversationData,
    loading: conversationLoading,
    error: conversationError,
    subscribeToMore,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );
  console.log("Here is conversationData", conversationData);

  /**
   * subscribes to a new conversation
   * and updates the query with the new conversation.
   */
  const subscribeToNewConversations = () => {
    console.log("subscribeToNewConversations -->");

    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;

        console.log("Here is subscriptionData", subscriptionData);

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

  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      {conversationLoading ? (
        <>Loading...</>
      ) : (
        <ConversationList
          session={session}
          conversations={conversationData?.conversations || []}
        />
      )}
    </Box>
  );
};

export default ConversationWrapper;
