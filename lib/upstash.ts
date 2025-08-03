import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import type { Lead, DemoAnalytics, DailyAnalytics, StorageKeys } from './types';

// Initialize Redis client conditionally
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiter setup - 10 requests per minute per IP (only if Redis is configured)
export const rateLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit',
}) : null;

// Storage key generators
export const STORAGE_KEYS: StorageKeys = {
  lead: (id: string) => `lead:${id}`,
  leadsList: 'leads:list',
  demoAnalytics: (sessionId: string) => `analytics:demo:${sessionId}`,
  dailyAnalytics: (date: string) => `analytics:daily:${date}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
};

// Lead storage functions with 30-day expiration (2592000 seconds)
export async function storeLead(lead: Lead): Promise<void> {
  if (!redis) {
    // Silently skip if Redis not configured
    return;
  }
  
  const key = STORAGE_KEYS.lead(lead.id);
  const pipeline = redis.pipeline();
  
  // Store lead data with expiration
  pipeline.setex(key, 2592000, JSON.stringify(lead));
  
  // Add to leads list for easier retrieval
  pipeline.zadd(STORAGE_KEYS.leadsList, {
    score: Date.now(),
    member: lead.id,
  });
  
  await pipeline.exec();
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!redis) return null;
  
  const key = STORAGE_KEYS.lead(id);
  const data = await redis.get<string>(key);
  
  if (!data) return null;
  
  try {
    return JSON.parse(data) as Lead;
  } catch (error) {
    console.error('Failed to parse lead data:', error);
    return null;
  }
}

export async function getRecentLeads(limit: number = 100): Promise<Lead[]> {
  if (!redis) return [];
  
  // Get lead IDs sorted by timestamp (newest first)
  const leadIds = await redis.zrange(STORAGE_KEYS.leadsList, 0, limit - 1, {
    rev: true,
  });
  
  if (!leadIds || leadIds.length === 0) return [];
  
  // Fetch lead data in batch
  const pipeline = redis.pipeline();
  leadIds.forEach((id) => {
    pipeline.get(STORAGE_KEYS.lead(id as string));
  });
  
  const results = await pipeline.exec();
  
  return results
    .filter((result): result is [unknown, string] => Array.isArray(result) && result[1])
    .map((result) => {
      try {
        return JSON.parse(result[1] as string) as Lead;
      } catch {
        return null;
      }
    })
    .filter((lead): lead is Lead => lead !== null);
}

// Analytics storage functions
export async function storeDemoAnalytics(analytics: DemoAnalytics): Promise<void> {
  if (!redis) {
    // Silently skip if Redis not configured
    return;
  }
  
  const key = STORAGE_KEYS.demoAnalytics(analytics.sessionId);
  
  // Store with 90-day expiration for analytics data
  await redis.setex(key, 7776000, JSON.stringify(analytics));
  
  // Update daily aggregates
  await updateDailyAnalytics(analytics);
}

export async function getDemoAnalytics(sessionId: string): Promise<DemoAnalytics | null> {
  if (!redis) return null;
  
  const key = STORAGE_KEYS.demoAnalytics(sessionId);
  const data = await redis.get<string>(key);
  
  if (!data) return null;
  
  try {
    return JSON.parse(data) as DemoAnalytics;
  } catch (error) {
    console.error('Failed to parse analytics data:', error);
    return null;
  }
}

// Helper function to update demo analytics (for ongoing sessions)
export async function updateDemoAnalytics(
  sessionId: string,
  updates: Partial<DemoAnalytics>
): Promise<void> {
  if (!redis) {
    // Silently skip if Redis not configured
    return;
  }
  
  const existing = await getDemoAnalytics(sessionId);
  
  if (!existing) {
    // Don't throw - this can happen if Redis was unavailable during start
    return;
  }
  
  const updated = { ...existing, ...updates };
  
  if (updates.endTime && existing.startTime) {
    updated.duration = updates.endTime - existing.startTime;
  }
  
  await storeDemoAnalytics(updated);
}

// Daily analytics aggregation
async function updateDailyAnalytics(analytics: DemoAnalytics): Promise<void> {
  if (!redis) return;
  
  const date = new Date(analytics.createdAt).toISOString().split('T')[0];
  const key = STORAGE_KEYS.dailyAnalytics(date);
  
  const existing = await redis.get<DailyAnalytics>(key);
  
  const updated: DailyAnalytics = existing || {
    date,
    totalViews: 0,
    oldVersionViews: 0,
    newVersionViews: 0,
    avgDuration: 0,
    avgInteractions: 0,
    totalInteractions: 0,
    uniqueSessions: 0,
  };
  
  // Update counters
  updated.totalViews += 1;
  updated.uniqueSessions += 1;
  
  if (analytics.version === 'old') {
    updated.oldVersionViews += 1;
  } else {
    updated.newVersionViews += 1;
  }
  
  // Update averages
  if (analytics.duration) {
    const totalDuration = updated.avgDuration * (updated.totalViews - 1) + analytics.duration;
    updated.avgDuration = totalDuration / updated.totalViews;
  }
  
  updated.totalInteractions += analytics.interactions;
  updated.avgInteractions = updated.totalInteractions / updated.totalViews;
  
  // Store with 180-day expiration for daily analytics
  await redis.setex(key, 15552000, updated);
}

export async function getDailyAnalytics(date: string): Promise<DailyAnalytics | null> {
  if (!redis) return null;
  
  const key = STORAGE_KEYS.dailyAnalytics(date);
  return await redis.get<DailyAnalytics>(key);
}

export async function getAnalyticsRange(
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> {
  if (!redis) return [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const analytics: DailyAnalytics[] = [];
  
  const pipeline = redis.pipeline();
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    pipeline.get(STORAGE_KEYS.dailyAnalytics(dateStr));
  }
  
  const results = await pipeline.exec();
  
  results.forEach((result) => {
    if (Array.isArray(result) && result[1]) {
      analytics.push(result[1] as DailyAnalytics);
    }
  });
  
  return analytics;
}

// Generic helper functions
export async function setWithExpiry(
  key: string,
  value: unknown,
  expirySeconds: number
): Promise<void> {
  if (!redis) return;
  await redis.setex(key, expirySeconds, JSON.stringify(value));
}

export async function get<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  const data = await redis.get<string>(key);
  
  if (!data) return null;
  
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('Failed to parse data:', error);
    return null;
  }
}

export async function increment(key: string, amount: number = 1): Promise<number> {
  if (!redis) return 0;
  return await redis.incrby(key, amount);
}

export async function decrement(key: string, amount: number = 1): Promise<number> {
  if (!redis) return 0;
  return await redis.decrby(key, amount);
}