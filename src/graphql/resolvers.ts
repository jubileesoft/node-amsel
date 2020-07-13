import { IResolvers } from 'graphql-tools';
import { AuthenticationError } from 'apollo-server-express';
import { MicrosoftUser } from '@jubileesoft/amsel';
import GenericApi from '../datasources/generic-api';
import {
  Collection,
  AddAppUserInput,
  AddAppInput,
  AddPrivilegeInput,
  UpdatePrivilegeInput,
  AddPrivilegePoolInput,
} from './types';
import { App, AppUser, Privilege, PrivilegePool } from './types';
import ISODate from './scalars/ISODate';

export interface ApolloServerContext {
  user: MicrosoftUser;
  dataSources: { genericApi: GenericApi };
}

interface AmselResolvers extends IResolvers {
  Mutation: {
    addApp(notUsed: unknown, args: { input: AddAppInput }, context: ApolloServerContext): Promise<App | null>;
    createAppApiKey1(notUsed: unknown, args: { appId: string }, context: ApolloServerContext): Promise<string | null>;
    addAppUser(
      notUsed: unknown,
      args: { appId: string; input: AddAppUserInput },
      context: ApolloServerContext,
    ): Promise<AppUser | null>;
    addPrivilege(
      notUsed: unknown,
      args: { appId: string; input: AddPrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null>;
    updatePrivilege(
      notUsed: unknown,
      args: { privilegeId: string; input: UpdatePrivilegeInput },
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
    getApps: async (_, ___, context: ApolloServerContext): Promise<App[] | null> => {
      ensureIsAuthenticated(context);
      const apps: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps);
      if (apps == null) {
        return null;
      }

      return apps.sort((a, b) => {
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();
        if (x < y) {
          return -1;
        }

        if (x > y) {
          return 1;
        }
        return 0;
      });
    },
    getApp: async (_, args: { id: string }, context: ApolloServerContext): Promise<App | null> => {
      const apps: App[] | null = await context.dataSources.genericApi.getCollection(Collection.apps, { id: args.id });
      if (apps == null || apps.length === 0) {
        return null;
      }

      return apps[0];
    },
    getAppUsers: async (_, args: { appId: string }, context: ApolloServerContext): Promise<AppUser[] | null> => {
      const appUsers: AppUser[] | null = await context.dataSources.genericApi.getAppUsers(args.appId);
      return appUsers;
    },

    getPrivileges: async (_, args: { appId?: string }, context: ApolloServerContext): Promise<Privilege[] | null> => {
      const privileges: Privilege[] | null = await context.dataSources.genericApi.getPrivileges(args.appId);
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
    async users(app: App, __, context: ApolloServerContext): Promise<AppUser[] | null> {
      return context.dataSources.genericApi.getAppUsers(app.id);
    },
  },
  AppUser: {
    async app(appUser: AppUser, __, context: ApolloServerContext): Promise<App | null> {
      return context.dataSources.genericApi.getAppFromAppUser(appUser.id);
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
    addApp: async (_, args: { input: AddAppInput }, context: ApolloServerContext): Promise<App | null> => {
      return context.dataSources.genericApi.addApp(args.input);
    },
    createAppApiKey1: async (_, args: { appId: string }, context: ApolloServerContext): Promise<string | null> => {
      return context.dataSources.genericApi.createAppApiKey1(args.appId);
    },
    addAppUser: async (
      _,
      args: { appId: string; input: AddAppUserInput },
      context: ApolloServerContext,
    ): Promise<AppUser | null> => {
      return context.dataSources.genericApi.addAppUser(args.appId, args.input);
    },

    addPrivilege: async (
      _,
      args: { appId: string; input: AddPrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null> => {
      return context.dataSources.genericApi.addPrivilege(args.appId, args.input);
    },

    updatePrivilege: async (
      _,
      args: { privilegeId: string; input: UpdatePrivilegeInput },
      context: ApolloServerContext,
    ): Promise<Privilege | null> => {
      return context.dataSources.genericApi.updatePrivilege(args.privilegeId, args.input);
    },

    addPrivilegePool: async (
      _,
      args: { appId: string; input: AddPrivilegePoolInput },
      context: ApolloServerContext,
    ): Promise<PrivilegePool | null> => {
      return context.dataSources.genericApi.addPrivilegePool(args.appId, args.input);
    },
  },
  // Scalars
  ISODate,
};

export default resolvers;
