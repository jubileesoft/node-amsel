const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type App {
    id: ID!
    owner: User!
    name: String!
  }
`;

export default typeDefs;
