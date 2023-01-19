import React, { useState } from "react";
import { Session } from "next-auth";
import { Box, Text } from "@chakra-ui/react";

import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../utils/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";

type Props = {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string) => void;
};

const ConversationList = ({
  session,
  conversations,
  onViewConversation,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { id: userId } = session.user;

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg={"blackAlpha.300"}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign={"center"} color="whiteAlpha.800" fontWeight={500}>
          Find or start a conversation
        </Text>
      </Box>
      <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          userId={userId}
          conversation={conversation}
          onClick={() => onViewConversation(conversation.id)}
          isSelected={conversation.id === router.query.conversationId}
        />
      ))}
    </Box>
  );
};

export default ConversationList;
