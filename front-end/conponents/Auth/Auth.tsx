import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "../../utils/types";

type Props = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth = ({ session, reloadSession }: Props) => {
  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      // create a mutatuion to graphql
      await createUsername({ variables: { username } });
    } catch (error) {
      console.log("onSubmit error", error);
    }
  };

  console.log("HERE IS DATA", data, loading, error);

  return (
    <Center height="100vh">
      <Stack align={"center"} spacing={8}>
        {session ? (
          <>
            <Text fontSize={"3xl"}>Create a username</Text>
            <Input
              placeholder="Enter yout name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize={"3xl"}>Messager</Text>
            <Button
              onClick={() => signIn("google")}
              leftIcon={<Image src="/google.png" height="20px" />}
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
