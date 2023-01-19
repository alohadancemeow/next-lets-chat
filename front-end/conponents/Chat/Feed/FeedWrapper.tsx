import React from "react";
import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

import MessagesHeader from "../Feed/Messages/Header";
import MessageInput from "./Messages/Input";
import Messages from "./Messages/Messages";

type Props = {
  session: Session;
};

const FeedWrapper = ({ session }: Props) => {
  const router = useRouter();

  const { conversationId } = router.query;
  const { id: userId } = session.user;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction={"column"}
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Flex
            direction={"column"}
            justify="space-between"
            overflow={"hidden"}
            flexGrow={1}
            border="1px solid red"
          >
            <MessagesHeader userId={userId} conversationId={conversationId} />
            <Messages userId={userId} conversationId={conversationId} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  );
};

export default FeedWrapper;
