import { IResolvers } from 'graphql-tools';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { MicrosoftUser } from '@jubileesoft/amsel';
import GenericApi from '../datasources/generic-api';
import { Collection } from './types';
import {App} from './types';

interface ApolloServerContext {
  user: MicrosoftUser;
  dataSources: { genericApi: GenericApi };
}

const ensureIsAuthenticated = (context: ApolloServerContext) => {
  if (!context.user) {
    throw new AuthenticationError('Unauthenticated.');
  }
};

const resolvers: IResolvers = {
  Query: {
    getAllApps: async (_, __, context: ApolloServerContext, ____) => {
      ensureIsAuthenticated(context);
      const asd: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps);
    },
  },
};

export default resolvers;
