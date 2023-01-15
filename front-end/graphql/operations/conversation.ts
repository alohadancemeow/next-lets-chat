import { gql } from "@apollo/client";

const ConversationFields = `
    id
    createdAt
    updatedAt
    participants {
      hasSeenLatestMessage
      id
      user {
        id
        username
      }
    }
    latestMessage {
      body
      createdAt
      id
      sender {
        id
        username
      }
    }
`;

export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `,
  },
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String!]) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription Subscription {
        conversationCreated {
         ${ConversationFields}
        }
      }
    `,
  },
};
