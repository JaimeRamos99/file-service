import { IDatabaseAdapter } from '../';
import { getKnexInstance } from './connection';

export class KnexAdapter<T extends object> implements IDatabaseAdapter<T> {
  private knex = getKnexInstance();

  async findOne(tableName: string, whereClause: object): Promise<T | undefined> {
    return this.knex<T>(tableName)
      .where(whereClause)
      .first()
      .then((result) => result as T | undefined);
  }

  async insert(tableName: string, data: T): Promise<T> {
    const [result] = (await this.knex<T, T>(tableName)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(data as any)
      .returning('*')) as T[];
    return result;
  }
}
