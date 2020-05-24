import mongo from 'mongodb';

export interface AppDoc {
  _id: mongo.ObjectID;
  owner_id: mongo.ObjectID;
  name: string;
}

export interface UserDoc {
  _id: mongo.ObjectID;
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
