import { IResolvers } from 'graphql-tools';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
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
    getAllUsers: async (_, __, context: ApolloServerContext): Promise<User[] | null> => {
      const users: User[] | null = await context.dataSources.genericApi.getCollection(Collection.users);
      return users;
    },
    getAllApps: async (_, ___, context: ApolloServerContext): Promise<App[] | null> => {
      ensureIsAuthenticated(context);
      const apps: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps);
      return apps;
    },
    getAllPrivileges: async (_, __, context: ApolloServerContext): Promise<Privilege[] | null> => {
      const privileges: Privilege[] | null = await context.dataSources.genericApi.getCollection(Collection.privileges);
      return privileges;
    },
  },
  App: {
    async owner(app: App, __, context: ApolloServerContext): Promise<User | null> {
      const user: User | null = await context.dataSources.genericApi.getOwnerFromApp(app.id);
      return user;
    },
  },
  Privilege: {
    async app(privilege: Privilege, __, context: ApolloServerContext): Promise<App | null> {
      const app: App | null = await context.dataSources.genericApi.getAppFromPrivilege(privilege.id);
      return app;
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
