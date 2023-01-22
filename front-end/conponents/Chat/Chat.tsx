import React from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import ConversationWrapper from "./Conversations/ConversationWrapper";
import FeedWrapper from "./Feed/FeedWrapper";

type Props = {
  session: Session;
};

const Chat = ({ session }: Props) => {
  return (
    <Flex height="100vh">
      <ConversationWrapper session={session} />
      <FeedWrapper session={session} />
      {/* <Button onClick={() => signOut()}>Sign out</Button> */}
    </Flex>
  );
};

export default Chat;
