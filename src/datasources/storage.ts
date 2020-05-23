/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, App, User } from '../graphql/types';

export default interface Storage {
  getDocuments(collection: Collection, filter?: any): Promise<any[] | null>;
  getDocument(collection: Collection, filter: any): Promise<any | null>;
  mapDocs(collection: Collection, docs: any[]): any[] | null;
  mapAppDoc(doc: any): App;
  mapAppDocs(docs: any[]): App[];
  mapUserDoc(doc: any): User;
  mapUserDocs(docs: any[]): User[];
  getOwner(appId: string): Promise<User | null>;
}
