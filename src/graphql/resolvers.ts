import { IResolvers } from 'graphql-tools';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { MicrosoftUser } from '@jubileesoft/amsel';
import GenericApi from '../datasources/generic-api';
import { Collection } from './types';
import { App, User } from './types';

interface ApolloServerContext {
  user: MicrosoftUser;
  dataSources: { genericApi: GenericApi };
}

const ensureIsAuthenticated = (context: ApolloServerContext) => {
  return;
  if (!context.user) {
    throw new AuthenticationError('Unauthenticated.');
  }
};

const resolvers: IResolvers = {
  Query: {
    getAllApps: async (_, __, context: ApolloServerContext, ____): Promise<App[] | null> => {
      ensureIsAuthenticated(context);
      const apps: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps);
      return apps;
    },
  },
  App: {
    async owner(app: App, __, context: ApolloServerContext, ____): Promise<User | null> {
      const user: User | null = await context.dataSources.genericApi.getOwner(app.id);
      return user;
    },
  },
};

export default resolvers;
