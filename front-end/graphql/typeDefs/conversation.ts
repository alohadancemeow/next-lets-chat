import { gql } from "@apollo/client";

const typeDefs = gql`
  type Mutation {
    createConversation(participantIds: [String]): CreateCoversationResponse
  }

  type CreateCoversationResponse {
    conversationId: String
  }
`;

export default typeDefs;
