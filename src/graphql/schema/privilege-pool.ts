const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type PrivilegePool {
    id: ID!
    appId: ID!
    name: String!
    short: String
    tags: [String]
    privileges: [Privilege]
  }
`;

export default typeDefs;
