import React, { useState } from "react";
import { Session } from "next-auth";
import { Box, Input } from "@chakra-ui/react";
import { toast } from "react-hot-toast";

type Props = {
  session: Session;
  conversationId: string;
};

const MessageInput = ({ conversationId, session }: Props) => {
  const [message, setMessage] = useState("");

  const onSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // call sendMessage mutation
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => {}}>
        <Input
          value={message}
          size={"md"}
          placeholder="New message"
          resize={"none"}
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAlpha.300",
          }}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </Box>
  );
};

export default MessageInput;
