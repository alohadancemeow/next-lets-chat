import React from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

type Props = {};

const Chat = (props: Props) => {
  return (
    <div>
      Chat
      <Button onClick={() => signOut()}>Sign out</Button>
    </div>
  );
};

export default Chat;
