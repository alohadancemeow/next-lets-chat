import { Button, Center, Image, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import React from "react";

type Props = {
    session?: Session | null;
    reloadSession?: () => void;
};

const Auth = ({ session, reloadSession }: Props) => {
    return (
        <Center height="100vh">
            <Stack align={"center"} spacing={8}>
                {session ? (
                    <Text>Create a username</Text>
                ) : (
                    <>
                        <Text fontSize={"3xl"}>Messager</Text>
                        <Button
                            onClick={() => signIn("google")}
                            leftIcon={<Image src="/google.png" />}
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
