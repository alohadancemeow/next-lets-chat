import React, { useState } from "react";
import { Session } from "next-auth";
import { Box, Button, Text } from "@chakra-ui/react";

import ConversationModal from "./Modal/ConversationModal";
import { ConversationPopulated } from "../../../utils/types";
import ConversationItem from "./ConversationItem";
import { useRouter } from "next/router";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import { signOut } from "next-auth/react";

type Props = {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (
    conversationId: string,
    hasSeenLastestMessage: boolean | undefined
  ) => void;
};

const ConversationList = ({
  session,
  conversations,
  onViewConversation,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Call deleteConversation mutation
  const [deleteConversation] = useMutation<{
    deleteConversation: boolean;
    conversationId: string;
  }>(ConversationOperations.Mutations.deleteConversation);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const { id: userId } = session.user;

  // Handle deleteConvrsation
  const onDeleteConversation = async (conversationId: string) => {
    try {
      toast.promise(
        deleteConversation({
          variables: { conversationId },
          update: () => {
            router.replace(
              typeof process.env.NEXT_PUBLIC_BASE_URL === "string"
                ? process.env.NEXT_PUBLIC_BASE_URL
                : ""
            );
          },
        }),
        {
          loading: "Deleting conversation",
          success: "Conversation deleted",
          error: "Failed to delete conversation",
        }
      );
    } catch (error: any) {
      console.log("onDeleteConversation error", error);
    }
  };

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      overflow="hidden"
      position={"relative"}
      height="100%"
    >
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
      {sortedConversations.map((conversation) => {
        const participant = conversation.participants.find(
          (p) => p.user.id === userId
        );

        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() =>
              onViewConversation(
                conversation.id,
                participant?.hasSeenLatestMessage
              )
            }
            hasSeenLatestMessage={participant?.hasSeenLatestMessage}
            isSelected={conversation.id === router.query.conversationId}
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
      <Box position={"absolute"} bottom={0} left={0} width="100%" px={8} py={6}>
        <Button width={"100%"} onClick={() => signOut()}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default ConversationList;
