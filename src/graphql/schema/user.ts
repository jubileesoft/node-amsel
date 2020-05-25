// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    offId: ID!
    email: String!
    tags: [String]
  }

  extend type Query {
    getAllUsers: [User]
  }

  input AddUserInput {
    offId: String!
    email: String!
    tags: [String]
  }

  extend type Mutation {
    addUser(input: AddUserInput!): User
  }
`;

export default typeDefs;
