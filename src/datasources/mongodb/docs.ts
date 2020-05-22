import mongo from 'mongodb';

export interface AppDoc {
  _id: mongo.ObjectID;
  ownerId: string;
  name: string;
}

export interface UserDoc {
  _id: mongo.ObjectID;
  offId: string;
  email: string;
  tags?: string[];
}
