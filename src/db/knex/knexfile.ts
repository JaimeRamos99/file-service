import { env } from '../../utils';
import type { Knex } from 'knex';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: env.DB_HOST_DEV,
      user: env.DB_USER_DEV,
      password: env.DB_PASSWORD_DEV,
      database: env.DB_NAME_DEV,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
      extension: 'ts',
    },
  },
};

export default knexConfig;
