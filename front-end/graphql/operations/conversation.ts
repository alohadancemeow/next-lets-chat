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
        image
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
    markConversationAsRead: gql`
      mutation MarkConversationAsRead(
        $userId: String!
        $conversationId: String!
      ) {
        markConversationAsRead(userId: $userId, conversationId: $conversationId)
      }
    `,
    deleteConversation: gql`
      mutation Mutation($conversationId: String!) {
        deleteConversation(conversationId: $conversationId)
      }
    `,
  },
  Subscriptions: {
    conversationCreated: gql`
      subscription ConversationCreated {
        conversationCreated {
         ${ConversationFields}
        }
      }
    `,
    conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
            conversation {
              ${ConversationFields}
            }
          }
      }
    `,
    conversationDeleted: gql`
      subscription ConversationDeleted {
        conversationDeleted {
          id
        }
      }
    `,
  },
};
