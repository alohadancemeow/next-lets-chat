import { NextPage, NextPageContext } from "next";

import { getSession, useSession } from "next-auth/react";
import Chat from "../conponents/Chat/Chat";
import Auth from "../conponents/Auth/Auth";
import { Box } from "@chakra-ui/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  console.log("HERE IS SWSSION", session);

  const reloadSesson = () => {};

  return (
    <Box>
      {session?.user.username ? (
        <Chat />
      ) : (
        <Auth session={session} reloadSession={reloadSesson} />
      )}
    </Box>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
