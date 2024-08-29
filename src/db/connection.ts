import Knex, { Knex as KnexType } from 'knex';
import knexConfig from './knexfile';
import { env } from '../utils';

const environment = env.NODE_ENV || 'development';
const config = knexConfig[environment];

let instance: KnexType | undefined;

// Function to get or create a Knex instance
function getKnexInstance() {
  if (!instance) {
    instance = Knex(config);
  }
  return instance;
}

module.exports = getKnexInstance;
