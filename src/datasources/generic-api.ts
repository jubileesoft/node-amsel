import { DataSource } from 'apollo-datasource';
import { MicrosoftUser } from '@jubileesoft/amsel';
import Persistence from './persistence';
import { App, User } from '../graphql/types';
import { Collection } from '../graphql/types';

export default class GenericApi extends DataSource {
  public context!: { user: MicrosoftUser };
  private storage: Persistence;

  constructor(persistence: Persistence) {
    super();
    this.storage = persistence;
  }

  initialize(config: any) {
    this.context = config.context;
  }

  // #region Public Methods
  public async getCollection(collection: Collection, filter?: any): Promise<any[] | null> {
    //this.storage.getCollection()
    return null;
  }

  // #endregion Public Methods
}
