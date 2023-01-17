import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ConversationPopulated } from "../../../utils/types";

type Props = {
  conversation: ConversationPopulated;
};

const ConversationItem = ({ conversation }: Props) => {
  return (
    <Stack p={4} _hover={{ bg: "whiteAlpha.200" }} borderRadius={4}>
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
