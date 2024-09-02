export interface IDatabaseAdapter<T extends object> {
  findOne(tableName: string, whereClause: object): Promise<T | undefined>;
  insert(tableName: string, data: T): Promise<T>;
}
