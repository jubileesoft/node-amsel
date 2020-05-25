export enum Collection {
  users,
  apps,
  privileges,
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
  ownerOffId: string;
}

export interface Privilege {
  id: string;
  app?: App;
  name: string;
  short?: string;
  tags?: string[];
}

export interface AddPrivilegeInput {
  appId: string;
  name: string;
  short?: string;
  tags: string[];
}
