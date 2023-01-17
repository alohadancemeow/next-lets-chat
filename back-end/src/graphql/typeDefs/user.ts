import gql from "graphql-tag";

// User shcema
const typeDefs = gql`
  scalar Date

  type User {
    id: String
    username: String
    image: String
  }

  type Query {
    searchUsers(username: String!): [User]
  }

  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default typeDefs;
