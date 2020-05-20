const { gql } = require('apollo-server-express');

import appTypeDefs from './schema/app';
import objectPoolTypeDefs from './schema/object-pool';
import objectTypeDefs from './schema/object';
import privilegePoolTypeDefs from './schema/privilege-pool';
import privilegeTypeDefs from './schema/privilege';
import userTypeDefs from './schema/user';

const root = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`;

const typeDefs = [
  root,
  appTypeDefs,
  objectPoolTypeDefs,
  objectTypeDefs,
  privilegePoolTypeDefs,
  privilegeTypeDefs,
  userTypeDefs,
];

export default typeDefs;
