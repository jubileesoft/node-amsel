import { IResolvers } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-express';
import { MicrosoftUser } from '@jubileesoft/amsel';
import GenericApi from '../datasources/generic-api';
import { Collection, AddUserInput, AddAppInput, AddPrivilegeInput } from './types';
import { App, User, Privilege } from './types';

interface ApolloServerContext {
  user: MicrosoftUser;
  dataSources: { genericApi: GenericApi };
}

const ensureIsAuthenticated = (context: ApolloServerContext): void => {
  return;
  if (!context.user) {
    throw new AuthenticationError('Unauthenticated.');
  }
};

const resolvers: IResolvers = {
  Query: {
    getAllApps: async (_, ___, context: ApolloServerContext): Promise<App[] | null> => {
      ensureIsAuthenticated(context);
      const apps: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps);
      return apps;
    },
  },
  App: {
    async owner(app: App, __, context: ApolloServerContext): Promise<User | null> {
      const user: User | null = await context.dataSources.genericApi.getOwner(app.id);
      return user;
    },
  },
  Mutation: {
    addUser: async (_, args: { input: AddUserInput }, context: ApolloServerContext): Promise<User | null> => {
      const user: User | null = await context.dataSources.genericApi.addUser(args.input);
      return user;
    },
    addApp: async (_, args: { input: AddAppInput }, context: ApolloServerContext): Promise<App | null> => {
      return context.dataSources.genericApi.addApp(args.input);
    },
    addPrivilege: async (
      _,
      args: { input: AddPrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null> => {
      return context.dataSources.genericApi.addPrivilege(args.input);
    },
  },
};

export default resolvers;
