// Mock Upstash modules before importing anything
jest.mock('@upstash/redis', () => {
  // Create mock instance inside the factory to avoid initialization issues
  const mockInstance = {
    pipeline: jest.fn(),
    setex: jest.fn(),
    get: jest.fn(),
    zadd: jest.fn(),
    zrange: jest.fn(),
    incrby: jest.fn(),
    decrby: jest.fn(),
  };
  
  return {
    Redis: jest.fn().mockImplementation(() => mockInstance),
  };
});

jest.mock('@upstash/ratelimit', () => {
  const mockInstance = {
    limit: jest.fn(),
  };
  
  const RatelimitMock = jest.fn().mockImplementation(() => mockInstance);
  RatelimitMock.slidingWindow = jest.fn(() => 'sliding-window-config');
  return {
    Ratelimit: RatelimitMock,
  };
});

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
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
  let mockRedisInstance: any;
  let mockPipeline: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked Redis instance
    mockRedisInstance = redis;
    
    // Setup mock pipeline
    mockPipeline = {
      setex: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      get: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    };

    // Update the mock instance methods
    mockRedisInstance.pipeline.mockReturnValue(mockPipeline);
    mockRedisInstance.setex.mockResolvedValue('OK');
    mockRedisInstance.get.mockResolvedValue(null);
    mockRedisInstance.zadd.mockResolvedValue(1);
    mockRedisInstance.zrange.mockResolvedValue([]);
    mockRedisInstance.incrby.mockResolvedValue(1);
    mockRedisInstance.decrby.mockResolvedValue(0);
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
        mockPipeline.exec.mockResolvedValue([
          [null, 'OK'],
          [null, 1],
        ]);

        await storeLead(mockLead);

        expect(mockRedisInstance.pipeline).toHaveBeenCalled();
        expect(mockPipeline.setex).toHaveBeenCalledWith(
          'lead:lead123',
          2592000, // 30 days in seconds
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
        mockRedisInstance.get.mockResolvedValue('invalid-json');

        const result = await getLead('lead123');

        expect(result).toBeNull();
      });
    });

    describe('getRecentLeads', () => {
      it('should retrieve recent leads in order', async () => {
        const leadIds = ['lead3', 'lead2', 'lead1'];
        mockRedisInstance.zrange.mockResolvedValue(leadIds);

        const leads = [mockLead, { ...mockLead, id: 'lead2' }, { ...mockLead, id: 'lead3' }];
        mockPipeline.exec.mockResolvedValue(
          leads.map(lead => [null, JSON.stringify(lead)])
        );

        const result = await getRecentLeads(3);

        expect(mockRedisInstance.zrange).toHaveBeenCalledWith('leads:list', 0, 2, { rev: true });
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual(leads[0]);
      });

      it('should handle empty results', async () => {
        mockRedisInstance.zrange.mockResolvedValue([]);

        const result = await getRecentLeads();

        expect(result).toEqual([]);
      });

      it('should filter out invalid leads', async () => {
        mockRedisInstance.zrange.mockResolvedValue(['lead1', 'lead2']);
        mockPipeline.exec.mockResolvedValue([
          [null, JSON.stringify(mockLead)],
          [null, 'invalid-json'],
        ]);

        const result = await getRecentLeads();

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(mockLead);
      });
    });
  });

  describe('Analytics Functions', () => {
    const mockAnalytics: DemoAnalytics = {
      sessionId: 'session123',
      version: 'new',
      startTime: 1722590400000,
      endTime: 1722590460000,
      duration: 60000,
      interactions: 5,
      viewportTime: 45000,
      createdAt: '2025-08-02T10:00:00Z',
    };

    describe('storeDemoAnalytics', () => {
      it('should store demo analytics with 90-day expiration', async () => {
        // Mock getDailyAnalytics for updateDailyAnalytics
        mockRedisInstance.get.mockResolvedValue(null);

        await storeDemoAnalytics(mockAnalytics);

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'analytics:demo:session123',
          7776000, // 90 days in seconds
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
        mockRedisInstance.get
          .mockResolvedValueOnce(JSON.stringify(mockAnalytics))
          .mockResolvedValueOnce(null); // For daily analytics update

        await updateDemoAnalytics('session123', { interactions: 10 });

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'analytics:demo:session123',
          7776000,
          expect.stringContaining('"interactions":10')
        );
      });

      it('should calculate duration when endTime is provided', async () => {
        const startAnalytics = { ...mockAnalytics, endTime: undefined, duration: undefined };
        mockRedisInstance.get
          .mockResolvedValueOnce(JSON.stringify(startAnalytics))
          .mockResolvedValueOnce(null);

        await updateDemoAnalytics('session123', { endTime: 1722590520000 });

        const savedData = JSON.parse(
          (mockRedisInstance.setex as jest.Mock).mock.calls[0][2]
        );
        expect(savedData.duration).toBe(120000); // 2 minutes
      });

      it('should throw error for non-existent session', async () => {
        mockRedisInstance.get.mockResolvedValue(null);

        await expect(
          updateDemoAnalytics('nonexistent', { interactions: 5 })
        ).rejects.toThrow('Demo analytics not found for session: nonexistent');
      });
    });

    describe('Daily Analytics', () => {
      const mockDailyAnalytics: DailyAnalytics = {
        date: '2025-08-02',
        totalViews: 100,
        oldVersionViews: 40,
        newVersionViews: 60,
        avgDuration: 45000,
        avgInteractions: 7.5,
        totalInteractions: 750,
        uniqueSessions: 100,
      };

      describe('getDailyAnalytics', () => {
        it('should retrieve daily analytics', async () => {
          mockRedisInstance.get.mockResolvedValue(mockDailyAnalytics);

          const result = await getDailyAnalytics('2025-08-02');

          expect(mockRedisInstance.get).toHaveBeenCalledWith('analytics:daily:2025-08-02');
          expect(result).toEqual(mockDailyAnalytics);
        });
      });

      describe('getAnalyticsRange', () => {
        it('should retrieve analytics for date range', async () => {
          const analytics1 = { ...mockDailyAnalytics, date: '2025-08-01' };
          const analytics2 = { ...mockDailyAnalytics, date: '2025-08-02' };

          mockPipeline.exec.mockResolvedValue([
            [null, analytics1],
            [null, analytics2],
          ]);

          const result = await getAnalyticsRange('2025-08-01', '2025-08-02');

          expect(mockRedisInstance.pipeline).toHaveBeenCalled();
          expect(mockPipeline.get).toHaveBeenCalledTimes(2);
          expect(result).toEqual([analytics1, analytics2]);
        });

        it('should handle missing data in range', async () => {
          mockPipeline.exec.mockResolvedValue([
            [null, mockDailyAnalytics],
            [null, null],
            [null, mockDailyAnalytics],
          ]);

          const result = await getAnalyticsRange('2025-08-01', '2025-08-03');

          expect(result).toHaveLength(2);
        });
      });
    });
  });

  describe('Generic Helper Functions', () => {
    describe('setWithExpiry', () => {
      it('should set value with expiration', async () => {
        await setWithExpiry('test:key', { data: 'value' }, 3600);

        expect(mockRedisInstance.setex).toHaveBeenCalledWith(
          'test:key',
          3600,
          JSON.stringify({ data: 'value' })
        );
      });
    });

    describe('get', () => {
      it('should retrieve and parse value', async () => {
        const testData = { foo: 'bar' };
        mockRedisInstance.get.mockResolvedValue(JSON.stringify(testData));

        const result = await get<typeof testData>('test:key');

        expect(result).toEqual(testData);
      });

      it('should return null for invalid JSON', async () => {
        mockRedisInstance.get.mockResolvedValue('invalid-json');

        const result = await get('test:key');

        expect(result).toBeNull();
      });
    });

    describe('increment', () => {
      it('should increment by default amount', async () => {
        mockRedisInstance.incrby.mockResolvedValue(5);

        const result = await increment('counter:key');

        expect(mockRedisInstance.incrby).toHaveBeenCalledWith('counter:key', 1);
        expect(result).toBe(5);
      });

      it('should increment by custom amount', async () => {
        mockRedisInstance.incrby.mockResolvedValue(15);

        const result = await increment('counter:key', 10);

        expect(mockRedisInstance.incrby).toHaveBeenCalledWith('counter:key', 10);
        expect(result).toBe(15);
      });
    });

    describe('decrement', () => {
      it('should decrement by default amount', async () => {
        mockRedisInstance.decrby.mockResolvedValue(3);

        const result = await decrement('counter:key');

        expect(mockRedisInstance.decrby).toHaveBeenCalledWith('counter:key', 1);
        expect(result).toBe(3);
      });

      it('should decrement by custom amount', async () => {
        mockRedisInstance.decrby.mockResolvedValue(0);

        const result = await decrement('counter:key', 5);

        expect(mockRedisInstance.decrby).toHaveBeenCalledWith('counter:key', 5);
        expect(result).toBe(0);
      });
    });
  });

  describe('Rate Limiter', () => {
    it('should be configured with sliding window', () => {
      // Since the module is already imported, these should have been called
      // Check that slidingWindow was called during module import
      expect(Ratelimit.slidingWindow).toHaveBeenCalled();
      
      // Check that Ratelimit constructor was called during module import
      expect(Ratelimit).toHaveBeenCalled();
      
      // Verify the rateLimiter was created
      expect(rateLimiter).toBeDefined();
    });
  });
});