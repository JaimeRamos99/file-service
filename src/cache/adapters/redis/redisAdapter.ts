import { ICacheAdapter } from '../';
import redis from 'redis';

export class RedisCacheAdapter implements ICacheAdapter {
  private client;

  constructor() {
    this.client = redis.createClient();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
