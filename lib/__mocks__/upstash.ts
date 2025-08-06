// Mock implementation of upstash module for testing

export const mockPipeline = {
  setex: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
};

export const mockRedisInstance = {
  pipeline: jest.fn().mockReturnValue(mockPipeline),
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(null),
  zadd: jest.fn().mockResolvedValue(1),
  zrange: jest.fn().mockResolvedValue([]),
  incrby: jest.fn().mockResolvedValue(1),
  decrby: jest.fn().mockResolvedValue(0),
};

export const mockRatelimitInstance = {
  limit: jest.fn().mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60000,
  }),
};

// Export mocked instances
export const redis = mockRedisInstance;
export const rateLimiter = mockRatelimitInstance;

// Storage key generators - must match the actual implementation
export const STORAGE_KEYS = {
  lead: (id: string) => `lead:${id}`,
  leadsList: 'leads:list',
  demoAnalytics: (sessionId: string) => `analytics:demo:${sessionId}`,
  dailyAnalytics: (date: string) => `analytics:daily:${date}`,
  rateLimit: (identifier: string) => `ratelimit:${identifier}`,
} as const;

// Mock implementations of all functions
export const storeLead = jest.fn(async (lead) => {
  const pipeline = mockRedisInstance.pipeline();
  pipeline.setex(STORAGE_KEYS.lead(lead.id), 2592000, JSON.stringify(lead));
  pipeline.zadd(STORAGE_KEYS.leadsList, {
    score: Date.now(),
    member: lead.id,
  });
  await pipeline.exec();
});

export const getLead = jest.fn(async (id: string) => {
  const data = await mockRedisInstance.get(STORAGE_KEYS.lead(id));
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
});

export const getRecentLeads = jest.fn(async (limit = 10) => {
  const leadIds = await mockRedisInstance.zrange(STORAGE_KEYS.leadsList, 0, limit - 1, { rev: true });
  if (!leadIds || leadIds.length === 0) return [];
  
  const pipeline = mockRedisInstance.pipeline();
  leadIds.forEach((id: string) => pipeline.get(STORAGE_KEYS.lead(id)));
  const results = await pipeline.exec();
  
  return results
    .map((data: any) => {
      if (!data) return null;
      try {
        return typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
});

export const storeDemoAnalytics = jest.fn(async (analytics) => {
  const key = STORAGE_KEYS.demoAnalytics(analytics.sessionId);
  const date = new Date(analytics.createdAt).toISOString().split('T')[0];
  const dailyKey = STORAGE_KEYS.dailyAnalytics(date);
  
  // Use pipeline to batch operations
  const pipeline = mockRedisInstance.pipeline();
  
  // Store analytics with 90-day expiration
  pipeline.setex(key, 7776000, JSON.stringify(analytics));
  
  // Get existing daily analytics for update
  pipeline.get(dailyKey);
  
  await pipeline.exec();
});

export const getDemoAnalytics = jest.fn(async (sessionId: string) => {
  const data = await mockRedisInstance.get(STORAGE_KEYS.demoAnalytics(sessionId));
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
});

export const getBatchDemoAnalytics = jest.fn(async (sessionIds: string[]) => {
  const result = new Map();
  if (sessionIds.length === 0) return result;
  
  const pipeline = mockRedisInstance.pipeline();
  sessionIds.forEach((sessionId) => {
    pipeline.get(STORAGE_KEYS.demoAnalytics(sessionId));
  });
  
  const results = await pipeline.exec();
  
  results.forEach((res: any, index: number) => {
    if (res && res[1]) {
      try {
        const analytics = typeof res[1] === 'string' ? JSON.parse(res[1]) : res[1];
        result.set(sessionIds[index], analytics);
      } catch {
        // Skip invalid data
      }
    }
  });
  
  return result;
});

export const updateDemoAnalytics = jest.fn(async (sessionId: string, updates: any) => {
  // Mock pipeline behavior for the new implementation
  const pipeline = mockRedisInstance.pipeline();
  pipeline.get(STORAGE_KEYS.demoAnalytics(sessionId));
  
  // Simulate getting existing data
  const existingData = await mockRedisInstance.get(STORAGE_KEYS.demoAnalytics(sessionId));
  
  if (!existingData) {
    throw new Error(`Demo analytics not found for session: ${sessionId}`);
  }
  
  const existing = typeof existingData === 'string' ? JSON.parse(existingData) : existingData;
  const updated = { ...existing, ...updates };
  
  // Handle incremental interaction updates
  if (updates.interactions !== undefined && existing.interactions !== undefined) {
    updated.interactions = existing.interactions + updates.interactions;
  }
  
  if (updates.endTime && existing.startTime) {
    updated.duration = updates.endTime - existing.startTime;
  }
  
  await mockRedisInstance.setex(
    STORAGE_KEYS.demoAnalytics(sessionId),
    7776000,
    JSON.stringify(updated)
  );
  
  return updated;
});

export const getDailyAnalytics = jest.fn(async (date: string) => {
  const data = await mockRedisInstance.get(STORAGE_KEYS.dailyAnalytics(date));
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
});

export const getAnalyticsRange = jest.fn(async (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }
  
  const pipeline = mockRedisInstance.pipeline();
  dates.forEach(date => pipeline.get(STORAGE_KEYS.dailyAnalytics(date)));
  const results = await pipeline.exec();
  
  return results
    .map((data: any, index: number) => {
      if (!data) return null;
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        return { date: dates[index], ...parsed };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
});

export const setWithExpiry = jest.fn(async (key: string, value: any, expirySeconds: number) => {
  return mockRedisInstance.setex(key, expirySeconds, JSON.stringify(value));
});

export const get = jest.fn(async (key: string) => {
  const data = await mockRedisInstance.get(key);
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
});

export const increment = jest.fn(async (key: string, amount = 1) => {
  return mockRedisInstance.incrby(key, amount);
});

export const decrement = jest.fn(async (key: string, amount = 1) => {
  return mockRedisInstance.decrby(key, amount);
});