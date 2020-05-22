// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    offId: ID!
    email: String!
    tags: [String]
  }
`;

export default typeDefs;
