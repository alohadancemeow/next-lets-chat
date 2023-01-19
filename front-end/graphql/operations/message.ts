import { gql } from "@apollo/client";

export const MessageFields = `
    body
    createdAt
    id
    sender {
        id
        image
        username
    }
`;

export default {
  Query: {
    messages: gql`
      query Messages($conversationId: String!) {
        messages(conversationId: $conversationId) {
          ${MessageFields}
        }
      }
    `,
  },
  Mutation: {
    sendMessage: gql`
      mutation SendMessage(
        $sendMessageId: String
        $conversationId: String
        $senderId: String
        $body: String
      ) {
        sendMessage(
          id: $sendMessageId
          conversationId: $conversationId
          senderId: $senderId
          body: $body
        )
      }
    `,
  },
  Subscription: {
    messageSent: gql`
      subscription Subscription($messageSentConversationId2: String) {
        messageSent(conversationId: $messageSentConversationId2) {
          ${MessageFields}
        }
      }
    `,
  },
};
