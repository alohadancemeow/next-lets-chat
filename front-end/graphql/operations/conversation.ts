import { gql } from "@apollo/client";

export default {
  Queries: {
    conversations: gql`
      query Conversations {
        conversations {
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
          createdAt
          id
          latestMessage {
            body
            createdAt
            id
            sender {
              id
              username
            }
          }
          participants {
            hasSeenLatestMessage
            id
            user {
              id
              username
            }
          }
          updatedAt
        }
      }
    `,
  },
};
