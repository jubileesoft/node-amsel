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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getDocuments(collection: Collection, filter?: object): Promise<any[] | null> {
    const col = collectionMap.get(collection);
    if (!col) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);
      const docs = await db
        .collection(col)
        .find(filter ?? {})
        .toArray();

      return docs;
    } catch (error) {
      return null;
    } finally {
      client?.close();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getDocument(collection: Collection, filter: any): Promise<any | null> {
    const col = collectionMap.get(collection);
    if (!col) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);
      const doc = await db.collection(col).findOne(filter);

      if (!doc) {
        return null;
      }

      switch (collection) {
        case Collection.apps:
          return this.mapAppDoc(doc);

        case Collection.users:
          return this.mapUserDoc(doc);

        default:
          return null;
      }
    } catch (error) {
      return null;
    } finally {
      client?.close();
    }
  }

  public mapAppDoc(doc: AppDoc): App {
    return this.mapAppDocToGql(doc);
  }

  public mapAppDocs(docs: AppDoc[]): App[] {
    const apps: App[] = docs.map((doc) => {
      return this.mapAppDocToGql(doc);
    });
    return apps;
  }

  public mapUserDoc(doc: UserDoc): User {
    return this.mapUserDocToGql(doc);
  }

  public mapUserDocs(docs: UserDoc[]): User[] {
    const users: User[] = docs.map((doc) => {
      return this.mapUserDocToGql(doc);
    });
    return users;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mapDocs(collection: Collection, docs: any[]): any[] | null {
    switch (collection) {
      case Collection.apps:
        return this.mapAppDocs(docs);

      case Collection.users:
        return this.mapUserDocs(docs);

      default:
        return null;
    }
  }

  public async getOwner(appId: string): Promise<User | null> {
    //
    const appDoc: AppDoc = await this.getDocument(Collection.apps, { _id: appId });
    if (!appDoc) {
      return null;
    }

    const userDoc: UserDoc = await this.getDocument(Collection.users, { _id: appDoc.ownerId });
    if (!userDoc) {
      return null;
    }

    return this.mapUserDoc(userDoc);
  }

  // #endregion Interface Methods

  // #region Private Methods

  private async getClient(): Promise<mongo.MongoClient> {
    return mongo.MongoClient.connect(this.config.url, {
      useUnifiedTopology: true,
    });
  }

  private mapAppDocToGql(doc: AppDoc): App {
    return {
      id: doc._id.toString(),
      name: doc.name,
    };
  }

  private mapUserDocToGql(doc: UserDoc): User {
    return {
      id: doc._id.toString(),
      offId: doc.offId,
      email: doc.email,
      tags: doc.tags,
    };
  }

  // #endregion Private Methods
}
