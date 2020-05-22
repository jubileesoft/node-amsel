import mongo from 'mongodb';
import { Collection } from '../graphql/types';
import { MongoDBConfig } from './mongodb/config';
import { AppDoc, UserDoc } from './mongodb/docs';
import { App, User } from '../graphql/types';
import Storage from './storage';

const collectionMap = new Map<Collection, string>();
collectionMap.set(Collection.apps, 'apps');
collectionMap.set(Collection.users, 'users');

export default class MongoDbStorage implements Storage {
  private config = MongoDBConfig;

  // #region Interface Methods

  public async getCollection(collection: Collection, filter?: object): Promise<any[] | null> {
    const col = collectionMap.get(collection);
    if (!col) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);
      const appDocs = await db
        .collection(col)
        .find(filter ?? {})
        .toArray();

      switch (collection) {
        case Collection.apps:
          const apps: App[] = (appDocs as AppDoc[]).map((appDoc) => {
            return {
              id: appDoc._id.toString(),
              name: appDoc.name,
            };
          });
          return apps;

        case Collection.users:
          const users: User[] = (appDocs as UserDoc[]).map((userDoc) => {
            return {
              id: userDoc._id.toString(),
              offId: userDoc.offId,
              email: userDoc.email,
              tags: userDoc.tags,
            };
          });
          return users;

        default:
          return null;
      }
    } catch (error) {
      return null;
    } finally {
      client?.close();
    }
  }

  // #endregion Interface Methods

  // #region Private Methods

  private async getClient(): Promise<mongo.MongoClient> {
    return mongo.MongoClient.connect(this.config.url, {
      useUnifiedTopology: true,
    });
  }

  // #endregion Private Methods
}
