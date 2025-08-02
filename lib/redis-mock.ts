/**
 * Mock-friendly Redis implementation for testing
 * This can be used when you need to test without actual Redis connection
 */

import type { Lead, DemoAnalytics, DailyAnalytics } from './types';

class MockRedis {
  private store: Map<string, any> = new Map();
  private ttls: Map<string, number> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const value = this.store.get(key);
    if (!value) return null;
    
    const ttl = this.ttls.get(key);
    if (ttl && Date.now() > ttl) {
      this.store.delete(key);
      this.ttls.delete(key);
      return null;
    }
    
    return JSON.parse(value);
  }

  async setex(key: string, seconds: number, value: string): Promise<string> {
    this.store.set(key, value);
    this.ttls.set(key, Date.now() + (seconds * 1000));
    return 'OK';
  }

  async zadd(key: string, options: { score: number; member: string }): Promise<number> {
    const list = this.store.get(key) || [];
    list.push(options);
    this.store.set(key, list);
    return 1;
  }

  async zrange(key: string, start: number, stop: number, options?: { rev?: boolean }): Promise<string[]> {
    const list = this.store.get(key) || [];
    const sorted = list.sort((a: any, b: any) => 
      options?.rev ? b.score - a.score : a.score - b.score
    );
    return sorted.slice(start, stop + 1).map((item: any) => item.member);
  }

  async incrby(key: string, amount: number): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current + amount;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  async decrby(key: string, amount: number): Promise<number> {
    const current = parseInt(this.store.get(key) || '0');
    const newValue = current - amount;
    this.store.set(key, newValue.toString());
    return newValue;
  }

  pipeline() {
    const commands: Array<() => Promise<any>> = [];
    const self = this;
    
    return {
      setex(key: string, seconds: number, value: string) {
        commands.push(() => self.setex(key, seconds, value));
        return this;
      },
      zadd(key: string, options: any) {
        commands.push(() => self.zadd(key, options));
        return this;
      },
      get(key: string) {
        commands.push(() => self.get(key));
        return this;
      },
      async exec() {
        const results = [];
        for (const cmd of commands) {
          try {
            const result = await cmd();
            results.push([null, result]);
          } catch (error) {
            results.push([error, null]);
          }
        }
        return results;
      }
    };
  }

  clear() {
    this.store.clear();
    this.ttls.clear();
  }
}

export const mockRedis = new MockRedis();

// Mock rate limiter
export const mockRateLimiter = {
  limit: async (identifier: string) => {
    // Simple mock implementation
    const key = `ratelimit:${identifier}`;
    const count = parseInt(await mockRedis.get(key) || '0');
    
    if (count >= 10) {
      return {
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 60000,
      };
    }
    
    await mockRedis.incrby(key, 1);
    await mockRedis.setex(key, 60, (count + 1).toString());
    
    return {
      success: true,
      limit: 10,
      remaining: 9 - count,
      reset: Date.now() + 60000,
    };
  }
};