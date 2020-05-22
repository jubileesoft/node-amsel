import { Collection } from '../graphql/types';

export default interface Storage {
  getCollection(collection: Collection, filter?: any): Promise<any[] | null>;
  getDocument(collection: Collection, filter: any): Promise<any | null>;
}
