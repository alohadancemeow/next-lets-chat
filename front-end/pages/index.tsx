import { NextPage, NextPageContext } from "next";

import { getSession, useSession } from "next-auth/react";
import Chat from "../conponents/Chat/Chat";
import Auth from "../conponents/Auth/Auth";
import { Box } from "@chakra-ui/react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  // console.log("HERE IS SESSION", session);

  // Reload session to obtain new username
  const reloadSession = () => {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user.username ? (
        <Chat session={session} />
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
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
