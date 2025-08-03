// Mock environment variables before importing anything
process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

// Create mock instances
const mockPipeline = {
  setex: jest.fn().mockReturnThis(),
  zadd: jest.fn().mockReturnThis(),
  get: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
};

const mockRedisInstance = {
  pipeline: jest.fn().mockReturnValue(mockPipeline),
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn().mockResolvedValue(null),
  zadd: jest.fn().mockResolvedValue(1),
  zrange: jest.fn().mockResolvedValue([]),
  incrby: jest.fn().mockResolvedValue(1),
  decrby: jest.fn().mockResolvedValue(0),
};

const mockRatelimitInstance = {
  limit: jest.fn(),
};

// Mock Upstash modules
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => mockRedisInstance),
}));

jest.mock('@upstash/ratelimit', () => {
  const RatelimitMock = jest.fn().mockImplementation(() => mockRatelimitInstance);
  RatelimitMock.slidingWindow = jest.fn(() => 'sliding-window-config');
  return {
    Ratelimit: RatelimitMock,
  };
});

// Now import the module after mocks are set up
import {
  redis,
  rateLimiter,
  storeLead,
  getLead,
  getRecentLeads,
  storeDemoAnalytics,
  getDemoAnalytics,
  updateDemoAnalytics,
  getDailyAnalytics,
  getAnalyticsRange,
  setWithExpiry,
  get,
  increment,
  decrement,
  STORAGE_KEYS,
} from '../upstash';
import type { Lead, DemoAnalytics, DailyAnalytics } from '../types';

describe('Upstash Redis Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset pipeline mock
    mockPipeline.setex.mockClear().mockReturnThis();
    mockPipeline.zadd.mockClear().mockReturnThis();
    mockPipeline.get.mockClear().mockReturnThis();
    mockPipeline.exec.mockClear().mockResolvedValue([]);
  });

  describe('Storage Keys', () => {
    it('should generate correct storage keys', () => {
      expect(STORAGE_KEYS.lead('123')).toBe('lead:123');
      expect(STORAGE_KEYS.leadsList).toBe('leads:list');
      expect(STORAGE_KEYS.demoAnalytics('session123')).toBe('analytics:demo:session123');
      expect(STORAGE_KEYS.dailyAnalytics('2025-08-02')).toBe('analytics:daily:2025-08-02');
      expect(STORAGE_KEYS.rateLimit('127.0.0.1')).toBe('ratelimit:127.0.0.1');
    });
  });

  describe('Lead Storage Functions', () => {
    const mockLead: Lead = {
      id: 'lead123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Acme Corp',
      message: 'Interested in your services',
      source: 'contact',
      createdAt: '2025-08-02T10:00:00Z',
    };

    describe('storeLead', () => {
      it('should store lead with 30-day expiration', async () => {
        await storeLead(mockLead);

        expect(mockRedisInstance.pipeline).toHaveBeenCalled();
        expect(mockPipeline.setex).toHaveBeenCalledWith(
          'lead:lead123',
          2592000,
          JSON.stringify(mockLead)
        );
        expect(mockPipeline.zadd).toHaveBeenCalledWith('leads:list', {
          score: expect.any(Number),
          member: 'lead123',
        });
        expect(mockPipeline.exec).toHaveBeenCalled();
      });
    });

    describe('getLead', () => {
      it('should retrieve and parse lead data', async () => {
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockLead));

        const result = await getLead('lead123');

        expect(mockRedisInstance.get).toHaveBeenCalledWith('lead:lead123');
        expect(result).toEqual(mockLead);
      });

      it('should return null for non-existent lead', async () => {
        mockRedisInstance.get.mockResolvedValue(null);

        const result = await getLead('nonexistent');

        expect(result).toBeNull();
      });

      it('should return null for invalid JSON', async () => {
        mockRedisInstance.get.mockResolvedValue('invalid json');

        const result = await getLead('lead123');

        expect(result).toBeNull();
      });
    });

    describe('getRecentLeads', () => {
      it('should retrieve recent leads in order', async () => {
        const leadIds = ['lead3', 'lead2', 'lead1'];
        mockRedisInstance.zrange.mockResolvedValue(leadIds);
        
        mockPipeline.exec.mockResolvedValue([
          JSON.stringify({ ...mockLead, id: 'lead3' }),
          JSON.stringify({ ...mockLead, id: 'lead2' }),
          JSON.stringify({ ...mockLead, id: 'lead1' }),
        ]);

        const result = await getRecentLeads(3);

        expect(mockRedisInstance.zrange).toHaveBeenCalledWith('leads:list', 0, 2, {
          rev: true,
        });
        expect(result).toHaveLength(3);
        expect(result[0].id).toBe('lead3');
      });

      it('should handle empty results', async () => {
        mockRedisInstance.zrange.mockResolvedValue([]);

        const result = await getRecentLeads(10);

        expect(result).toEqual([]);
      });

      it('should filter out invalid leads', async () => {
        mockRedisInstance.zrange.mockResolvedValue(['lead1', 'lead2']);
        mockPipeline.exec.mockResolvedValue([
          JSON.stringify(mockLead),
          'invalid json',
        ]);

        const result = await getRecentLeads(2);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(mockLead);
      });
    });
  });

  describe('Analytics Functions', () => {
    const mockAnalytics: DemoAnalytics = {
      sessionId: 'session123',
      version: 'new',
      startTime: 1234567890,
      interactions: 5,
      createdAt: '2025-08-02T10:00:00Z',
    };

    describe('storeDemoAnalytics', () => {
      it('should store demo analytics with 90-day expiration', async () => {
        await storeDemoAnalytics(mockAnalytics);

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'analytics:demo:session123',
          7776000,
          JSON.stringify(mockAnalytics)
        );
      });
    });

    describe('getDemoAnalytics', () => {
      it('should retrieve and parse analytics data', async () => {
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockAnalytics));

        const result = await getDemoAnalytics('session123');

        expect(mockRedisInstance.get).toHaveBeenCalledWith('analytics:demo:session123');
        expect(result).toEqual(mockAnalytics);
      });
    });

    describe('updateDemoAnalytics', () => {
      it('should update existing analytics', async () => {
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockAnalytics));

        await updateDemoAnalytics('session123', { interactions: 10 });

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'analytics:demo:session123',
          7776000,
          JSON.stringify({ ...mockAnalytics, interactions: 10 })
        );
      });

      it('should calculate duration when endTime is provided', async () => {
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockAnalytics));

        const endTime = mockAnalytics.startTime + 60000;
        await updateDemoAnalytics('session123', { endTime });

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'analytics:demo:session123',
          7776000,
          expect.stringContaining('"duration":60000')
        );
      });

      it('should throw error for non-existent session', async () => {
        mockRedisInstance.get.mockResolvedValue(null);

        await expect(
          updateDemoAnalytics('nonexistent', { interactions: 5 })
        ).rejects.toThrow('Demo analytics not found');
      });
    });

    describe('Daily Analytics', () => {
      const mockDailyAnalytics: DailyAnalytics = {
        date: '2025-08-02',
        totalViews: 100,
        oldVersionViews: 40,
        newVersionViews: 60,
        avgDuration: 45000,
        avgInteractions: 8,
        totalInteractions: 800,
        uniqueSessions: 100,
      };

      describe('getDailyAnalytics', () => {
        it('should retrieve daily analytics', async () => {
          mockRedisInstance.get.mockResolvedValue(JSON.stringify(mockDailyAnalytics));

          const result = await getDailyAnalytics('2025-08-02');

          expect(mockRedisInstance.get).toHaveBeenCalledWith('analytics:daily:2025-08-02');
          expect(result).toEqual(mockDailyAnalytics);
        });
      });

      describe('getAnalyticsRange', () => {
        it('should retrieve analytics for date range', async () => {
          mockPipeline.exec.mockResolvedValue([
            JSON.stringify(mockDailyAnalytics),
            JSON.stringify({ ...mockDailyAnalytics, date: '2025-08-03' }),
          ]);

          const result = await getAnalyticsRange('2025-08-02', '2025-08-03');

          expect(result).toHaveLength(2);
          expect(result[0].date).toBe('2025-08-02');
          expect(result[1].date).toBe('2025-08-03');
        });

        it('should handle missing data in range', async () => {
          mockPipeline.exec.mockResolvedValue([
            JSON.stringify(mockDailyAnalytics),
            null,
            JSON.stringify({ ...mockDailyAnalytics, date: '2025-08-04' }),
          ]);

          const result = await getAnalyticsRange('2025-08-02', '2025-08-04');

          expect(result).toHaveLength(2);
        });
      });
    });
  });

  describe('Generic Helper Functions', () => {
    describe('setWithExpiry', () => {
      it('should set value with expiration', async () => {
        await setWithExpiry('test-key', { data: 'test' }, 3600);

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'test-key',
          3600,
          '{"data":"test"}'
        );
      });
    });

    describe('get', () => {
      it('should retrieve and parse value', async () => {
        const testData = { data: 'test' };
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(testData));

        const result = await get<typeof testData>('test-key');

        expect(result).toEqual(testData);
      });

      it('should return null for invalid JSON', async () => {
        mockRedisInstance.get.mockResolvedValue('invalid');

        const result = await get('test-key');

        expect(result).toBeNull();
      });
    });

    describe('increment', () => {
      it('should increment by default amount', async () => {
        await increment('counter');

        expect(mockRedisInstance.incrby).toHaveBeenCalledWith('counter', 1);
      });

      it('should increment by custom amount', async () => {
        await increment('counter', 5);

        expect(mockRedisInstance.incrby).toHaveBeenCalledWith('counter', 5);
      });
    });

    describe('decrement', () => {
      it('should decrement by default amount', async () => {
        await decrement('counter');

        expect(mockRedisInstance.decrby).toHaveBeenCalledWith('counter', 1);
      });

      it('should decrement by custom amount', async () => {
        await decrement('counter', 3);

        expect(mockRedisInstance.decrby).toHaveBeenCalledWith('counter', 3);
      });
    });
  });

  describe('Rate Limiter', () => {
    it('should be configured with sliding window', () => {
      expect(rateLimiter).toBeDefined();
      const { Ratelimit } = require('@upstash/ratelimit');
      expect(Ratelimit.slidingWindow).toHaveBeenCalledWith(10, '1 m');
    });
  });
});