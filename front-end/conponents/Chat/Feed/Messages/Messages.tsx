import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  MessageSubscriptionData,
  MessagesVariables,
  MesssagesData,
} from "../../../../utils/types";
import MessageOperations from "../../../../graphql/operations/message";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../../../common/SkeletonLoader";
import MessageItem from "./MessageItem";

type Props = {
  userId: string;
  conversationId: string;
};

const Messages = ({ userId, conversationId }: Props) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MesssagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: { conversationId },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  console.log("here is message data", data?.messages);

  if (error) return null;

  // Subscription
  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: { conversationId },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, []);

  return (
    <Flex direction={"column"} justify="flex-end" overflow="hidden">
      {loading && (
        <Stack spacing={4} px={4}>
          <SkeletonLoader count={4} height="60px" />
        </Stack>
      )}

      {data?.messages && (
        <Flex direction={"column-reverse"} overflowY="scroll" height="100%">
          {data.messages.map((message) => (
            <MessageItem
              message={message}
              sentByme={message.sender.id === userId}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
