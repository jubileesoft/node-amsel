/* eslint-disable @typescript-eslint/no-explicit-any */
import { Collection, App, User, AddUserInput, AddAppInput, AddPrivilegeInput, Privilege } from '../graphql/types';

export default interface Storage {
  getDocuments(collection: Collection, filter?: any): Promise<any[] | null>;
  getDocument(collection: Collection, filter: any): Promise<any | null>;
  mapDocs(collection: Collection, docs: any[]): any[] | null;
  mapAppDoc(doc: any): App;
  mapAppDocs(docs: any[]): App[];
  mapUserDoc(doc: any): User;
  mapUserDocs(docs: any[]): User[];
  mapPrivilegeDoc(doc: any): Privilege;
  mapPrivilegeDocs(docs: any[]): Privilege[];
  getOwnerFromApp(appId: string): Promise<any | null>;
  getAppFromPrivilege(privilegeId: string): Promise<any | null>;
  addUser(input: AddUserInput): Promise<any | null>;
  addApp(input: AddAppInput): Promise<any | null>;
  addPrivilege(input: AddPrivilegeInput): Promise<any | null>;
}
