import React from "react";
import { Session } from "next-auth";
import { Box } from "@chakra-ui/react";
import ConversationList from "./ConversationList";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../../../graphql/operations/conversation";
import { ConversationsData } from "../../../utils/types";

type Props = {
  session: Session;
};

const ConversationWrapper = ({ session }: Props) => {
  const {
    data: conversationData,
    loading: conversationLoading,
    error: conversationError,
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );
  console.log("Here is data", conversationData);

  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3}>
      <ConversationList session={session} />
    </Box>
  );
};

export default ConversationWrapper;
