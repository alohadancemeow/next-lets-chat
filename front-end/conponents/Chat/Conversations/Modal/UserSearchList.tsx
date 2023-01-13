import React from "react";
import { Avatar, Flex, Stack, Text, Button } from "@chakra-ui/react";
import { SearchUser } from "../../../../utils/types";

type Props = {
  users: Array<SearchUser>;
  addParticipant: (user: SearchUser) => void;
};

const UserSearchList = ({ users, addParticipant }: Props) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text>No users found</Text>
        </Flex>
      ) : (
        <Stack mt={6}>
          {users.map((user) => (
            <Stack
              direction="row"
              align={"center"}
              py={2}
              px={2}
              spacing={4}
              borderRadius={4}
              _hover={{ bg: "whiteAlpha.200" }}
              key={user.id}
            >
              <Avatar src={user.image}/>
              <Flex justify={"space-between"} align="center" width="100%">
                <Text color={"whiteAlpha.700"}> {user.username}</Text>
                <Button
                  bg="brand.100"
                  _hover={{ bg: "brand.100" }}
                  onClick={() => addParticipant(user)}
                >
                  Selecet
                </Button>
              </Flex>
            </Stack>
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserSearchList;
