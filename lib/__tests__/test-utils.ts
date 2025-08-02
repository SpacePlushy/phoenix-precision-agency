// Test utilities for mocking Upstash Redis and Ratelimit

export function setupRedisMocks() {
  const mockPipeline = {
    setex: jest.fn().mockReturnThis(),
    zadd: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  const mockRedisInstance = {
    pipeline: jest.fn(() => mockPipeline),
    setex: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    zadd: jest.fn().mockResolvedValue(1),
    zrange: jest.fn().mockResolvedValue([]),
    incrby: jest.fn().mockResolvedValue(1),
    decrby: jest.fn().mockResolvedValue(0),
  };

  return { mockRedisInstance, mockPipeline };
}

export function setupRatelimitMocks() {
  const mockRatelimitInstance = {
    limit: jest.fn().mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 60000,
    }),
  };

  return { mockRatelimitInstance };
}