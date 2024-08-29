import knex from 'knex';
import knexConfig from './knexfile';
import { env } from '../utils';

// Assume the environment is 'development' for setups
const environment = env.NODE_ENV || 'development';
const config = knexConfig[environment];

// Initialize Knex
const db = knex(config);

// Example query function
export async function fetchAllFiles() {
  try {
    const files = await db.select('*').from('files');
    console.log('Files:', files);
  } catch (error) {
    console.error('Error fetching files:', error);
  } finally {
    // Be sure to close the connection when no longer needed
    await db.destroy();
  }
}
