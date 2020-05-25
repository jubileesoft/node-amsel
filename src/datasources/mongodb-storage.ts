import mongo from 'mongodb';
import { Collection, Privilege } from '../graphql/types';
import { MongoDBConfig } from './mongodb/config';
import { AppDoc, UserDoc, PrivilegeDoc } from './mongodb/docs';
import { App, User, AddUserInput, AddAppInput, AddPrivilegeInput } from '../graphql/types';
import Storage from './storage';

const collectionMap = new Map<Collection, string>();
collectionMap.set(Collection.apps, 'apps');
collectionMap.set(Collection.users, 'users');
collectionMap.set(Collection.privileges, 'privileges');

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
      return doc;
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

  public mapPrivilegeDoc(doc: PrivilegeDoc): Privilege {
    return this.mapPrivilegeDocToGql(doc);
  }

  public mapPrivilegeDocs(docs: PrivilegeDoc[]): Privilege[] {
    const privileges: Privilege[] = docs.map((doc) => {
      return this.mapPrivilegeDocToGql(doc);
    });
    return privileges;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mapDocs(collection: Collection, docs: any[]): any[] | null {
    switch (collection) {
      case Collection.apps:
        return this.mapAppDocs(docs);

      case Collection.users:
        return this.mapUserDocs(docs);

      case Collection.privileges:
        return this.mapPrivilegeDocs(docs);

      default:
        return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getOwnerFromApp(appId: string): Promise<any | null> {
    //
    const appDoc: AppDoc = await this.getDocument(Collection.apps, { _id: new mongo.ObjectID(appId) });
    if (!appDoc) {
      return null;
    }

    const userDoc: UserDoc = await this.getDocument(Collection.users, { _id: appDoc.owner_id });
    return userDoc;
  }

  public async getAppFromPrivilege(privilegeId: string): Promise<any | null> {
    const privilegeDoc: PrivilegeDoc = await this.getDocument(Collection.privileges, {
      _id: new mongo.ObjectID(privilegeId),
    });
    if (!privilegeDoc) {
      return null;
    }

    const appDoc: AppDoc = await this.getDocument(Collection.apps, { _id: privilegeDoc.app_id });
    return appDoc;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addUser(input: AddUserInput): Promise<any | null> {
    const col = collectionMap.get(Collection.users);
    if (!col) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);

      const user = await db.collection(col).findOne({ offId: input.offId });
      if (user) {
        // A user with the same offId already exists. Just return this one.
        return user;
      }

      const newUser: UserDoc = {
        _id: new mongo.ObjectID(),
        email: input.email,
        offId: input.offId,
        tags: input.tags,
      };

      await db.collection(col).insertOne(newUser);
      return newUser;
    } catch (error) {
      return null;
    } finally {
      client?.close();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addApp(input: AddAppInput): Promise<any | null> {
    const appsCollection = collectionMap.get(Collection.apps);
    const usersCollection = collectionMap.get(Collection.users);
    if (!appsCollection || !usersCollection) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);

      // Get intended owner first
      const ownerDoc: UserDoc | null = await db.collection(usersCollection).findOne({ offId: input.ownerOffId });
      if (!ownerDoc) {
        return null;
      }

      const newApp: AppDoc = {
        _id: new mongo.ObjectID(),
        // eslint-disable-next-line @typescript-eslint/camelcase
        owner_id: ownerDoc._id,
        name: input.name,
      };
      await db.collection(appsCollection).insertOne(newApp);
      return newApp;
    } catch (error) {
      return null;
    } finally {
      client?.close();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async addPrivilege(input: AddPrivilegeInput): Promise<any | null> {
    const appsCollection = collectionMap.get(Collection.apps);
    const privilegesCollection = collectionMap.get(Collection.privileges);
    if (!appsCollection || !privilegesCollection) {
      return null;
    }

    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();

      const db = client.db(this.config.database);

      // Get app
      const appDoc: AppDoc | null = await db
        .collection(appsCollection)
        .findOne({ _id: new mongo.ObjectID(input.appId) });
      if (!appDoc) {
        return null;
      }

      const newDoc: PrivilegeDoc = {
        _id: new mongo.ObjectID(),
        // eslint-disable-next-line @typescript-eslint/camelcase
        app_id: appDoc._id,
        name: input.name,
        short: input.short,
        tags: input.tags,
      };
      await db.collection(privilegesCollection).insertOne(newDoc);
      return newDoc;
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

  private mapPrivilegeDocToGql(doc: PrivilegeDoc): Privilege {
    return {
      id: doc._id.toString(),
      //appId: doc.app_id.toString(),
      name: doc.name,
      short: doc.short,
      tags: doc.tags,
    };
  }

  // #endregion Private Methods
}
