import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import React from "react";
import { MessagesVariables, MesssagesData } from "../../../../utils/types";
import MessageOperations from "../../../../graphql/operations/message";
import { toast } from "react-hot-toast";

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

  console.log("here is message data", data);

  return (
    <Flex direction={"column"} justify="flex-end" overflow={"hidden"}>
      {loading && (
        <Stack>
          <span>loading messages</span>
        </Stack>
      )}

      {data?.messages && (
        <Flex direction={"column-reverse"} overflowY="scroll" height={"100%"}>
          {data.messages.map((message) => (
            <div key={message.id}>{message.body}</div>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
