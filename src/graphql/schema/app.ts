// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type App {
    id: ID!
    owner: User!
    name: String!
  }

  extend type Query {
    getAllApps: [App]
  }
`;

export default typeDefs;
