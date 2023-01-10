import { NextPage, NextPageContext } from 'next'

import { getSession, useSession } from 'next-auth/react'
import Chat from '../conponents/Chat/Chat';
import Auth from '../conponents/Auth/Auth';
import { Box } from '@chakra-ui/react';

const Home: NextPage = () => {

  const { data, status } = useSession()
  console.log('HERE IS DATA', data);


  return (
    <Box>
      {data?.user.username
        ? <Chat />
        : <Auth />
      }
    </Box>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)

  return {
    props: {
      session
    },
  }
}

export default Home
