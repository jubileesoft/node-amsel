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
    appId: String!
    name: String!
    short: String
    tags: [String]
  }

  extend type Query {
    getAllPrivileges: [Privilege]
  }

  extend type Mutation {
    addPrivilege(input: AddPrivilegeInput!): Privilege
  }
`;

export default typeDefs;
