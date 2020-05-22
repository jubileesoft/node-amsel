export default interface Persistence {
  getCollection(collection: string, filter: any): Promise<any[] | null>;
}
