export enum Collection {
  users,
  apps,
  privileges,
  privilegepools,
}

export interface User {
  id: string;
  offId: string;
  email: string;
  tags?: string[];
}

export interface AddUserInput {
  offId: string;
  email: string;
  tags?: string[];
}

export interface App {
  id: string;
  name: string;
  owner?: User;
}

export interface AddAppInput {
  name: string;
  ownerId: string;
}

export interface Privilege {
  id: string;
  app?: App;
  name: string;
  short?: string;
  tags?: string[];
}

export interface AddPrivilegeInput {
  name: string;
  short?: string;
  tags: string[];
}

export interface PrivilegePool {
  id: string;
  app?: App;
  name: string;
  short?: string;
  tags?: string[];
  privileges?: Privilege[];
}

export interface AddPrivilegePoolInput {
  name: string;
  short?: string;
  tags?: string[];
  privilegeIds: string[];
}
