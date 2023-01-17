import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { SearchUser } from "../../../../utils/types";
import { IoMdCloseCircleOutline } from "react-icons/io";

type Props = {
  participants: Array<SearchUser>;
  removeParticipant: (userId: string) => void;
};

const Participants = ({ participants, removeParticipant }: Props) => {
  return (
    <Flex mt={8} gap="10px" flexWrap={"wrap"}>
      {participants.map((participant) => (
        <Stack
          direction={"row"}
          align="center"
          bg="whiteAlpha.200"
          borderRadius={4}
          p={2}
        >
          <Text>{participant.username}</Text>
          <IoMdCloseCircleOutline
            size={20}
            cursor={"pointer"}
            onClick={() => removeParticipant(participant.id)}
          />
        </Stack>
      ))}
    </Flex>
  );
};

export default Participants;
