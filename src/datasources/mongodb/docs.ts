import mongo from 'mongodb';

export interface AppDoc {
  _id: mongo.ObjectID;
  owner: string;
  name: string;
}

export interface AppUserDoc {
  _id: mongo.ObjectID;
  app_id: mongo.ObjectID;
  offId: string;
  email: string;
  tags?: string[];
}

export interface PrivilegeDoc {
  _id: mongo.ObjectID;
  app_id: mongo.ObjectID;
  name: string;
  short?: string;
  tags?: string[];
}

export interface PrivilegePoolDoc {
  _id: mongo.ObjectID;
  app_id: mongo.ObjectID;
  name: string;
  short?: string;
  tags?: string[];
  privilege_ids?: mongo.ObjectID[];
}
