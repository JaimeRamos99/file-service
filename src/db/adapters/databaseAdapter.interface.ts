export interface IDatabaseAdapter<T extends {}> {
  findOne(tableName: string, whereClause: object): Promise<T | undefined>;
  insert(tableName: string, data: T): Promise<T>;
}
