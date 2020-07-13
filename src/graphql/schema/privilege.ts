// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Privilege {
    id: ID!
    app: App!
    name: String!
    short: String
    tags: [String]
  }

  input AddPrivilegeInput {
    name: String!
    short: String
    tags: [String]
  }

  input UpdatePrivilegeInput {
    name: String
    short: String
    tags: [String]
  }

  extend type Query {
    getPrivileges(appId: String): [Privilege]
  }

  extend type Mutation {
    addPrivilege(appId: String!, input: AddPrivilegeInput!): Privilege
    updatePrivilege(privilegeId: String!, input: UpdatePrivilegeInput!): Privilege
  }
`;

export default typeDefs;
