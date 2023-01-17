import React, { useState } from "react";
import { Session } from "next-auth";
import { Box, Text } from "@chakra-ui/react";

import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../utils/types";
import ConversationItem from "./ConversationItem";

type Props = {
  session: Session;
  conversations: Array<ConversationPopulated>;
};

const ConversationList = ({ session, conversations }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

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
        <ConversationItem key={conversation.id} conversation={conversation} />
      ))}
    </Box>
  );
};

export default ConversationList;
