import { IResolvers } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-express';
import { MicrosoftUser } from '@jubileesoft/amsel';
import GenericApi from '../datasources/generic-api';
import { Collection, AddUserInput, AddAppInput, AddPrivilegeInput, AddPrivilegePoolInput } from './types';
import { App, User, Privilege, PrivilegePool } from './types';

export interface ApolloServerContext {
  user: MicrosoftUser;
  dataSources: { genericApi: GenericApi };
}

interface AmselResolvers extends IResolvers {
  Mutation: {
    addUser(notUsed: unknown, args: { input: AddUserInput }, context: ApolloServerContext): Promise<User | null>;
    addApp(notUsed: unknown, args: { input: AddAppInput }, context: ApolloServerContext): Promise<App | null>;
    addPrivilege(
      notUsed: unknown,
      args: { appId: string; input: AddPrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null>;
    addPrivilegePool(
      notUsed: unknown,
      args: { appId: string; input: AddPrivilegePoolInput },
      context: ApolloServerContext,
    ): Promise<PrivilegePool | null>;
  };
}

const ensureIsAuthenticated = (context: ApolloServerContext): void => {
  return;
  if (!context.user) {
    throw new AuthenticationError('Unauthenticated.');
  }
};

const resolvers: AmselResolvers = {
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
    getAllPrivilegePools: async (_, __, context: ApolloServerContext): Promise<PrivilegePool[] | null> => {
      const privilegePools: PrivilegePool[] | null = await context.dataSources.genericApi.getCollection(
        Collection.privilegepools,
      );
      return privilegePools;
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
  PrivilegePool: {
    async app(privilegePool: PrivilegePool, __, context: ApolloServerContext): Promise<App | null> {
      return context.dataSources.genericApi.getAppFromPrivilegePool(privilegePool.id);
    },
    async privileges(privilegePool: PrivilegePool, __, context: ApolloServerContext): Promise<Privilege[] | null> {
      return context.dataSources.genericApi.getPrivilegesFromPrivilegePool(privilegePool.id);
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
      args: { appId: string; input: AddPrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null> => {
      return context.dataSources.genericApi.addPrivilege(args.appId, args.input);
    },
    addPrivilegePool: async (
      _,
      args: { appId: string; input: AddPrivilegePoolInput },
      context: ApolloServerContext,
    ): Promise<PrivilegePool | null> => {
      return context.dataSources.genericApi.addPrivilegePool(args.appId, args.input);
    },
  },
};

export default resolvers;
