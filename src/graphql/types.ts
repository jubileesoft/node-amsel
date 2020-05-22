export enum Collection {
  users,
  apps,
}

export interface User {
  id: string;
  offId: string;
  email: string;
  tags?: string[];
}

export interface App {
  id: string;
  name: string;
  owner?: User;
}
