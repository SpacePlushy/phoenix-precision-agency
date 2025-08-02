// Mock Upstash modules before importing anything
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    pipeline: jest.fn(),
    setex: jest.fn(),
    get: jest.fn(),
    zadd: jest.fn(),
    zrange: jest.fn(),
  })),
}));

jest.mock('@upstash/ratelimit', () => {
  const RatelimitMock = jest.fn().mockImplementation(() => ({
    limit: jest.fn(),
  }));
  RatelimitMock.slidingWindow = jest.fn(() => 'sliding-window-config');
  return {
    Ratelimit: RatelimitMock,
  };
});

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import {
  storeLead,
  getLead,
  getRecentLeads,
  rateLimiter,
} from '../upstash';
import {
  generateSessionId,
  trackDemoStart,
  trackDemoEnd,
  trackDemoInteraction,
  getAnalyticsSummary,
  compareVersionPerformance,
} from '../analytics';
import type { Lead } from '../types';

describe('Integration Tests', () => {
  let mockRedis: jest.Mocked<Redis>;
  let mockRatelimit: jest.Mocked<Ratelimit>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup comprehensive mocks
    const dataStore = new Map<string, any>();
    const ttlStore = new Map<string, number>();
    
    mockRedis = {
      get: jest.fn((key: string) => {
        const data = dataStore.get(key);
        if (data && ttlStore.has(key)) {
          const ttl = ttlStore.get(key)!;
          if (Date.now() > ttl) {
            dataStore.delete(key);
            ttlStore.delete(key);
            return Promise.resolve(null);
          }
        }
        return Promise.resolve(data || null);
      }),
      setex: jest.fn((key: string, seconds: number, value: string) => {
        dataStore.set(key, value);
        ttlStore.set(key, Date.now() + (seconds * 1000));
        return Promise.resolve('OK');
      }),
      zadd: jest.fn(() => Promise.resolve(1)),
      zrange: jest.fn(() => Promise.resolve([])),
      pipeline: jest.fn(() => ({
        setex: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => Promise.resolve([])),
      })),
    } as any;

    mockRatelimit = {
      limit: jest.fn(() => Promise.resolve({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 60000,
      })),
    } as any;

    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => mockRedis);
    (Ratelimit as jest.MockedClass<typeof Ratelimit>).mockImplementation(() => mockRatelimit);
  });

  describe('Lead Management Flow', () => {
    it('should handle complete lead lifecycle', async () => {
      const lead: Lead = {
        id: 'test-lead-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        company: 'Tech Corp',
        message: 'Need help with optimization',
        source: 'contact',
        createdAt: new Date().toISOString(),
      };

      // Store lead
      await storeLead(lead);
      
      // Verify storage calls
      expect(mockRedis.pipeline).toHaveBeenCalled();
      
      // Mock retrieval
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(lead));
      
      // Retrieve lead
      const retrieved = await getLead(lead.id);
      
      expect(retrieved).toEqual(lead);
    });

    it('should handle multiple leads with recent retrieval', async () => {
      const leads: Lead[] = Array.from({ length: 5 }, (_, i) => ({
        id: `lead-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        source: 'demo',
        createdAt: new Date(Date.now() - i * 1000).toISOString(),
      }));

      // Store all leads
      for (const lead of leads) {
        await storeLead(lead);
      }

      // Mock zrange to return lead IDs
      mockRedis.zrange.mockResolvedValueOnce(leads.map(l => l.id));
      
      // Mock pipeline exec to return all leads
      const mockPipeline = {
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => 
          Promise.resolve(leads.map(lead => [null, JSON.stringify(lead)]))
        ),
      };
      mockRedis.pipeline.mockReturnValueOnce(mockPipeline as any);

      // Get recent leads
      const recent = await getRecentLeads(3);
      
      expect(recent).toHaveLength(3);
      expect(mockRedis.zrange).toHaveBeenCalledWith('leads:list', 0, 2, { rev: true });
    });
  });

  describe('Demo Analytics Flow', () => {
    it('should track complete demo session', async () => {
      const sessionId = generateSessionId();
      
      // Start tracking
      await trackDemoStart(sessionId, 'new');
      
      // Simulate interactions
      for (let i = 0; i < 5; i++) {
        // Mock existing analytics for interaction tracking
        mockRedis.get.mockResolvedValueOnce(JSON.stringify({
          sessionId,
          version: 'new',
          startTime: Date.now() - 10000,
          interactions: i,
          createdAt: new Date().toISOString(),
        }));
        
        await trackDemoInteraction(sessionId);
      }
      
      // End tracking
      await trackDemoEnd(sessionId);
      
      // Verify calls
      expect(mockRedis.setex).toHaveBeenCalled();
      expect(mockRedis.get).toHaveBeenCalledTimes(5); // One for each interaction
    });

    it('should aggregate analytics correctly', async () => {
      // Mock daily analytics data
      const dailyData = {
        date: new Date().toISOString().split('T')[0],
        totalViews: 100,
        oldVersionViews: 45,
        newVersionViews: 55,
        avgDuration: 45000,
        avgInteractions: 6.5,
        totalInteractions: 650,
        uniqueSessions: 100,
      };

      // Mock pipeline for getAnalyticsRange
      const mockPipeline = {
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => Promise.resolve([[null, dailyData]])),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      const summary = await getAnalyticsSummary(1);
      
      expect(summary.totalViews).toBe(100);
      expect(summary.newVersionPercentage).toBe(55);
      expect(summary.oldVersionPercentage).toBe(45);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const identifier = '127.0.0.1';
      
      // First request should succeed
      let result = await rateLimiter.limit(identifier);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(9);
      
      // Simulate exhausting rate limit
      mockRatelimit.limit.mockResolvedValueOnce({
        success: false,
        limit: 10,
        remaining: 0,
        reset: Date.now() + 60000,
      });
      
      result = await rateLimiter.limit(identifier);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('Performance Comparison', () => {
    it('should compare versions with statistical significance', async () => {
      // Mock analytics data showing new version performing better
      const analyticsData = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        totalViews: 200,
        oldVersionViews: 80,
        newVersionViews: 120,
        avgDuration: 50000,
        avgInteractions: 8,
        totalInteractions: 1600,
        uniqueSessions: 200,
      }));

      const mockPipeline = {
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => 
          Promise.resolve(analyticsData.map(data => [null, data]))
        ),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      const comparison = await compareVersionPerformance(7);
      
      expect(comparison.newVersion.views).toBeGreaterThan(comparison.oldVersion.views);
      expect(comparison.winner).toBe('new');
      expect(comparison.confidence).toBeGreaterThan(50); // Should have good confidence
    });
  });

  describe('Error Handling', () => {
    it('should handle Redis connection errors gracefully', async () => {
      mockRedis.get.mockRejectedValueOnce(new Error('Connection failed'));
      
      const result = await getLead('test-id');
      
      // Should throw or handle error appropriately
      expect(result).toBeNull();
    });

    it('should handle malformed data gracefully', async () => {
      mockRedis.get.mockResolvedValueOnce('{"invalid": json');
      
      const result = await getLead('test-id');
      
      expect(result).toBeNull();
    });
  });

  describe('TTL and Expiration', () => {
    it('should respect 30-day expiration for leads', async () => {
      const lead: Lead = {
        id: 'expiring-lead',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      };

      await storeLead(lead);
      
      // Check that setex was called with 30-day expiration (2592000 seconds)
      const pipelineMock = mockRedis.pipeline();
      expect(pipelineMock.setex).toHaveBeenCalledWith(
        'lead:expiring-lead',
        2592000,
        JSON.stringify(lead)
      );
    });
  });
});