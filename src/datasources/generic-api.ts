import { DataSource } from 'apollo-datasource';
import { MicrosoftUser } from '@jubileesoft/amsel';
import Storage from './storage';
import { Collection, User, AddUserInput, App, AddAppInput, AddPrivilegeInput, Privilege } from '../graphql/types';

export default class GenericApi extends DataSource {
  public context!: { user: MicrosoftUser };
  private storage: Storage;

  constructor(storage: Storage) {
    super();
    this.storage = storage;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialize(config: any): void {
    this.context = config.context;
  }

  // #region Public Methods

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCollection(collection: Collection, filter?: any): Promise<any[] | null> {
    const docs = await this.storage.getDocuments(collection, filter);
    if (!docs) {
      return null;
    }
    return this.storage.mapDocs(collection, docs);
  }

  public async getOwnerFromApp(appId: string): Promise<User | null> {
    const doc = await this.storage.getOwnerFromApp(appId);
    if (!doc) {
      return null;
    }
    return this.storage.mapUserDoc(doc);
  }

  public async getAppFromPrivilege(privilegeId: string): Promise<App | null> {
    const doc = await this.storage.getAppFromPrivilege(privilegeId);
    if (!doc) {
      return null;
    }
    return this.storage.mapAppDoc(doc);
  }

  public async getAppFromPrivilegePool(privilegePoolId: string): Promise<App | null> {
    const doc = await this.storage.getAppFromPrivilegePool(privilegePoolId);
    if (!doc) {
      return null;
    }
    return this.storage.mapAppDoc(doc);
  }

  public async getPrivilegesFromPrivilegePool(privilegePoolId: string): Promise<Privilege[] | null> {
    const docs = await this.storage.getPrivilegesFromPrivilegePool(privilegePoolId);
    if (!docs) {
      return null;
    }
    return this.storage.mapDocs(Collection.privileges, docs);
  }

  public async addUser(input: AddUserInput): Promise<User | null> {
    const doc = await this.storage.addUser(input);
    if (!doc) {
      return null;
    }
    return this.storage.mapUserDoc(doc);
  }

  public async addApp(input: AddAppInput): Promise<App | null> {
    const doc = await this.storage.addApp(input);
    if (!doc) {
      return null;
    }
    return this.storage.mapAppDoc(doc);
  }

  public async addPrivilege(input: AddPrivilegeInput): Promise<Privilege | null> {
    const doc = await this.storage.addPrivilege(input);
    if (!doc) {
      return null;
    }
    return this.storage.mapPrivilegeDoc(doc);
  }

  // #endregion Public Methods
}
