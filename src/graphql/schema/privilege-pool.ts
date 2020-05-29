// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type PrivilegePool {
    id: ID!
    app: App!
    name: String!
    short: String
    tags: [String]
    privileges: [Privilege!]!
  }

  extend type Query {
    getAllPrivilegePools: [PrivilegePool]
  }

  input AddPrivilegePoolInput {
    name: String!
    short: String
    tags: [String]
    privilegeIds: [String!]!
  }

  extend type Mutation {
    addPrivilegePool(appId: String!, input: AddPrivilegePoolInput!): PrivilegePool
  }
`;

export default typeDefs;
