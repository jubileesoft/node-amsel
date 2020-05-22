import { DataSource } from 'apollo-datasource';
import { MicrosoftUser } from '@jubileesoft/amsel';
import Storage from './storage';
import { Collection, App, User } from '../graphql/types';
import { AppDoc, UserDoc } from './mongodb/docs';

export default class GenericApi extends DataSource {
  public context!: { user: MicrosoftUser };
  private storage: Storage;

  constructor(storage: Storage) {
    super();
    this.storage = storage;
  }

  initialize(config: any): void {
    this.context = config.context;
  }

  // #region Public Methods

  public async getCollection(collection: Collection, filter?: any): Promise<any[] | null> {
    return this.storage.getCollection(collection, filter);
  }

  public async getOwner(appId: string): Promise<User | null> {
    const appDoc: AppDoc = await this.storage.getDocument(Collection.apps, { _id: appId });
    if (!appDoc) {
      return null;
    }

    const userDoc: UserDoc = await this.storage.getDocument(Collection.users, { _id: appDoc.ownerId });
    if (!userDoc) {
      return null;
    }

    const user: User = {
      id: userDoc._id.toString(),
      offId: userDoc.offId,
      email: userDoc.email,
      tags: userDoc.tags,
    };
    return user;
  }

  // #endregion Public Methods
}
