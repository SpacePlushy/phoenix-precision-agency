// Mock implementation of upstash module for testing

// Store for in-memory testing
const mockLeadStore = new Map<string, any>();
const mockLeadList: { score: number; member: string }[] = [];

export const mockPipeline = {
  setex: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
};

export const mockRedisInstance = {
  pipeline: jest.fn().mockReturnValue(mockPipeline),
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn((key: string) => {
    // Return data from in-memory store
    const id = key.replace('lead:', '');
    const lead = mockLeadStore.get(id);
    return Promise.resolve(lead ? JSON.stringify(lead) : null);
  }),
  zadd: jest.fn().mockResolvedValue(1),
  zrange: jest.fn(() => {
    // Return sorted lead IDs
    const sorted = [...mockLeadList]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.member);
    return Promise.resolve(sorted);
  }),
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
  // Store in memory for retrieval
  mockLeadStore.set(lead.id, lead);
  mockLeadList.push({ score: Date.now(), member: lead.id });
  
  const pipeline = mockRedisInstance.pipeline();
  pipeline.setex(STORAGE_KEYS.lead(lead.id), 2592000, JSON.stringify(lead));
  pipeline.zadd(STORAGE_KEYS.leadsList, {
    score: Date.now(),
    member: lead.id,
  });
  await pipeline.exec();
});

export const getLead = jest.fn(async (id: string) => {
  return mockLeadStore.get(id) || null;
});

export const getRecentLeads = jest.fn(async (limit = 10) => {
  // Sort by score (timestamp) descending and return the most recent
  const sorted = [...mockLeadList]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return sorted.map(item => mockLeadStore.get(item.member)).filter(Boolean);
});

// Analytics mock functions
export const storeDemoAnalytics = jest.fn(async (analytics) => {
  const key = STORAGE_KEYS.demoAnalytics(analytics.sessionId);
  await mockRedisInstance.setex(key, 7776000, JSON.stringify(analytics));
});

export const getDemoAnalytics = jest.fn(async (sessionId: string) => {
  const key = STORAGE_KEYS.demoAnalytics(sessionId);
  const data = await mockRedisInstance.get(key);
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
});

export const updateDemoAnalytics = jest.fn(async (sessionId: string, updates: any) => {
  const existing = await getDemoAnalytics(sessionId);
  if (!existing) throw new Error(`Demo analytics not found for session: ${sessionId}`);
  
  const updated = { ...existing, ...updates };
  
  // Handle incremental updates
  if (updates.interactions !== undefined && existing.interactions !== undefined) {
    updated.interactions = existing.interactions + updates.interactions;
  }
  
  if (updates.endTime && existing.startTime) {
    updated.duration = updates.endTime - existing.startTime;
  }
  
  await storeDemoAnalytics(updated);
});

export const getDailyAnalytics = jest.fn(async (date: string) => {
  return null;
});

export const getAnalyticsRange = jest.fn(async (startDate: string, endDate: string) => {
  return [];
});

export const getBatchDemoAnalytics = jest.fn(async (sessionIds: string[]) => {
  return new Map();
});

// Generic helper functions
export const setWithExpiry = jest.fn(async (key: string, value: unknown, expirySeconds: number) => {
  await mockRedisInstance.setex(key, expirySeconds, JSON.stringify(value));
});

export const get = jest.fn(async (key: string) => {
  const data = await mockRedisInstance.get(key);
  if (!data) return null;
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return null;
  }
});

export const increment = jest.fn(async (key: string, amount = 1) => {
  return await mockRedisInstance.incrby(key, amount);
});

export const decrement = jest.fn(async (key: string, amount = 1) => {
  return await mockRedisInstance.decrby(key, amount);
});

// Clear mock data for testing
export const clearMockData = () => {
  mockLeadStore.clear();
  mockLeadList.length = 0;
};