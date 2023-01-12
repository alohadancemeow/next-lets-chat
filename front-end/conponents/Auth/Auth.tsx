import { useMutation } from "@apollo/client";
import { Button, Center, Image, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { CreateUsernameData, CreateUsernameVariables } from "../../utils/types";
import { toast } from "react-hot-toast";

type Props = {
  session: Session | null;
  reloadSession: () => void;
};

const Auth = ({ session, reloadSession }: Props) => {
  const [username, setUsername] = useState("");

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  // console.log("HERE IS DATA", data, loading, error);

  const onSubmit = async () => {
    if (!username) return;
    try {
      // create a mutatuion to graphql
      const { data } = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success("Username successfully created! 🎉");

      // Reload session to obtain new username
      reloadSession();
    } catch (error: any) {
      toast.error(error?.message);
      console.log("onSubmit error", error);
    }
  };

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
