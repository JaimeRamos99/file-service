import { ICacheAdapter } from '../';
import { createClient } from 'redis';
import { Logger } from '../../../utils';

export class RedisCacheAdapter implements ICacheAdapter {
  private client;

  constructor() {
    this.client = createClient();
    this.connectClient();
  }

  private async connectClient(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      Logger.error('Failed to connect to Redis:', error as Error);
    }
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
