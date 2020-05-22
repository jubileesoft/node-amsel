// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Privilege {
    id: ID!
    appId: ID!
    name: String!
    short: String
    tags: [String]
  }

  input addPrivilegeInput {
    appId: ID!
    name: String!
    short: String
    tags: [String]
  }

  extend type Mutation {
    addPrivilege(input: addPrivilegeInput): Privilege
  }
`;

export default typeDefs;
