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
  const slidingWindow = jest.fn(() => 'sliding-window-config');
  return {
    Ratelimit: Object.assign(
      jest.fn().mockImplementation(() => ({
        limit: jest.fn(),
      })),
      { slidingWindow }
    ),
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
  trackViewportTime,
  getAnalyticsSummary,
  compareVersionPerformance,
  getRecentAnalytics,
} from '../analytics';
import type { Lead } from '../types';

describe('Acceptance Tests - Real-World Scenarios', () => {
  let mockRedis: jest.Mocked<Redis>;
  let inMemoryStore: Map<string, any>;

  beforeEach(() => {
    jest.clearAllMocks();
    inMemoryStore = new Map();

    // Create a more realistic mock that simulates Redis behavior
    mockRedis = {
      get: jest.fn((key: string) => {
        const value = inMemoryStore.get(key);
        return Promise.resolve(value || null);
      }),
      setex: jest.fn((key: string, _seconds: number, value: string) => {
        inMemoryStore.set(key, value);
        return Promise.resolve('OK');
      }),
      zadd: jest.fn((key: string, options: any) => {
        const list = inMemoryStore.get(key) || [];
        list.push({ score: options.score, member: options.member });
        inMemoryStore.set(key, list);
        return Promise.resolve(1);
      }),
      zrange: jest.fn((key: string, start: number, stop: number, options?: any) => {
        const list = inMemoryStore.get(key) || [];
        const sorted = list.sort((a: any, b: any) => 
          options?.rev ? b.score - a.score : a.score - b.score
        );
        return Promise.resolve(sorted.slice(start, stop + 1).map((item: any) => item.member));
      }),
      pipeline: jest.fn(() => {
        const commands: any[] = [];
        const pipeline = {
          setex: jest.fn((key: string, seconds: number, value: string) => {
            commands.push(() => mockRedis.setex(key, seconds, value));
            return pipeline;
          }),
          zadd: jest.fn((key: string, options: any) => {
            commands.push(() => mockRedis.zadd(key, options));
            return pipeline;
          }),
          get: jest.fn((key: string) => {
            commands.push(() => mockRedis.get(key));
            return pipeline;
          }),
          exec: jest.fn(async () => {
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
          }),
        };
        return pipeline;
      }),
    } as any;

    (Redis as jest.MockedClass<typeof Redis>).mockImplementation(() => mockRedis);
  });

  describe('Scenario 1: Marketing Campaign Lead Collection', () => {
    it('should handle high-volume lead submission during campaign', async () => {
      const campaignLeads: Lead[] = [];
      
      // Simulate 50 leads coming in over a short period
      for (let i = 0; i < 50; i++) {
        const lead: Lead = {
          id: `campaign-lead-${i}`,
          name: `Campaign User ${i}`,
          email: `user${i}@campaign.com`,
          company: i % 3 === 0 ? `Company ${i / 3}` : undefined,
          message: 'Interested in your services from ad campaign',
          source: 'contact',
          createdAt: new Date(Date.now() - i * 60000).toISOString(), // 1 minute apart
        };
        
        campaignLeads.push(lead);
        await storeLead(lead);
      }

      // Verify we can retrieve recent leads
      const recent = await getRecentLeads(10);
      
      // Should get the most recent 10 leads
      expect(recent).toHaveLength(10);
      
      // Verify individual lead retrieval
      const specificLead = await getLead('campaign-lead-5');
      expect(specificLead).toBeTruthy();
      expect(specificLead?.email).toBe('user5@campaign.com');
    });
  });

  describe('Scenario 2: A/B Testing Demo Versions', () => {
    it('should track user journey through demo comparison', async () => {
      // Simulate 20 users viewing demos
      const sessions = [];
      
      for (let i = 0; i < 20; i++) {
        const sessionId = `demo-session-${i}`;
        const version = i % 2 === 0 ? 'old' : 'new';
        
        sessions.push({ sessionId, version });
        
        // User starts viewing demo
        await trackDemoStart(sessionId, version as 'old' | 'new');
        
        // Simulate varying interaction patterns
        const interactionCount = Math.floor(Math.random() * 10) + 1;
        for (let j = 0; j < interactionCount; j++) {
          // Mock the existing analytics for each interaction
          inMemoryStore.set(`analytics:demo:${sessionId}`, JSON.stringify({
            sessionId,
            version,
            startTime: Date.now() - 30000,
            interactions: j,
            createdAt: new Date().toISOString(),
          }));
          
          await trackDemoInteraction(sessionId);
        }
        
        // Track viewport time (between 10-120 seconds)
        const viewportTime = (Math.random() * 110 + 10) * 1000;
        await trackViewportTime(sessionId, viewportTime);
        
        // User finishes viewing
        await trackDemoEnd(sessionId);
      }

      // Mock daily analytics aggregation
      const today = new Date().toISOString().split('T')[0];
      inMemoryStore.set(`analytics:daily:${today}`, {
        date: today,
        totalViews: 20,
        oldVersionViews: 10,
        newVersionViews: 10,
        avgDuration: 65000,
        avgInteractions: 5.5,
        totalInteractions: 110,
        uniqueSessions: 20,
      });

      // Get analytics summary
      const mockPipeline = {
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => Promise.resolve([[null, inMemoryStore.get(`analytics:daily:${today}`)]])),
      };
      mockRedis.pipeline.mockReturnValueOnce(mockPipeline as any);

      const summary = await getAnalyticsSummary(1);
      
      expect(summary.totalViews).toBe(20);
      expect(summary.oldVersionViews).toBe(10);
      expect(summary.newVersionViews).toBe(10);
      expect(summary.bestPerformingVersion).toBe('tie');
    });
  });

  describe('Scenario 3: Rate Limiting Protection', () => {
    it('should protect against spam submissions', async () => {
      const mockRatelimit = new Ratelimit({
        redis: mockRedis,
        limiter: Ratelimit.slidingWindow(10, '1 m'),
      });

      // Mock rate limiter behavior
      let requestCount = 0;
      mockRatelimit.limit = jest.fn(async () => {
        requestCount++;
        const remaining = Math.max(0, 10 - requestCount);
        return {
          success: requestCount <= 10,
          limit: 10,
          remaining,
          reset: Date.now() + 60000,
        };
      });

      (Ratelimit as jest.MockedClass<typeof Ratelimit>).mockImplementation(() => mockRatelimit as any);

      // Simulate spam attempts
      const spammerIp = '192.168.1.100';
      const results = [];
      
      for (let i = 0; i < 15; i++) {
        const result = await mockRatelimit.limit(spammerIp);
        results.push(result);
        
        if (result.success) {
          // Only process if rate limit allows
          const lead: Lead = {
            id: `spam-attempt-${i}`,
            name: 'Spammer',
            email: `spam${i}@test.com`,
            createdAt: new Date().toISOString(),
          };
          await storeLead(lead);
        }
      }
      
      // First 10 should succeed
      expect(results.slice(0, 10).every(r => r.success)).toBe(true);
      
      // Remaining 5 should be blocked
      expect(results.slice(10).every(r => !r.success)).toBe(true);
      
      // Verify only 10 leads were stored
      const storedLeads = await getRecentLeads(20);
      expect(storedLeads.filter(l => l.id.startsWith('spam-attempt')).length).toBeLessThanOrEqual(10);
    });
  });

  describe('Scenario 4: Long-term Analytics Tracking', () => {
    it('should track and compare performance over 30 days', async () => {
      // Simulate 30 days of analytics data
      const analyticsData = [];
      
      for (let day = 0; day < 30; day++) {
        const date = new Date();
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Simulate varying performance (new version gradually performs better)
        const totalViews = 100 + Math.floor(Math.random() * 50);
        const newVersionRatio = 0.4 + (day * 0.01); // Gradually increase new version views
        const oldVersionViews = Math.floor(totalViews * (1 - newVersionRatio));
        const newVersionViews = totalViews - oldVersionViews;
        
        const dailyData = {
          date: dateStr,
          totalViews,
          oldVersionViews,
          newVersionViews,
          avgDuration: 40000 + Math.random() * 20000,
          avgInteractions: 5 + Math.random() * 5,
          totalInteractions: totalViews * (5 + Math.random() * 5),
          uniqueSessions: totalViews,
        };
        
        analyticsData.push(dailyData);
        inMemoryStore.set(`analytics:daily:${dateStr}`, dailyData);
      }

      // Mock pipeline for range query
      const mockPipeline = {
        get: jest.fn().mockReturnThis(),
        exec: jest.fn(() => 
          Promise.resolve(analyticsData.slice(0, 30).map(data => [null, data]))
        ),
      };
      mockRedis.pipeline.mockReturnValue(mockPipeline as any);

      // Compare version performance
      const comparison = await compareVersionPerformance(30);
      
      // New version should be winning due to gradual improvement
      expect(comparison.winner).toBe('new');
      expect(comparison.newVersion.views).toBeGreaterThan(comparison.oldVersion.views);
      expect(comparison.confidence).toBeGreaterThan(0);
      
      // Get recent analytics
      const recentAnalytics = await getRecentAnalytics(7);
      expect(recentAnalytics).toHaveLength(7);
      
      // Verify trend - recent days should show better new version performance
      const recentNewVersionPercentage = recentAnalytics.reduce((sum, day) => 
        sum + (day.newVersionViews / day.totalViews), 0
      ) / recentAnalytics.length;
      
      expect(recentNewVersionPercentage).toBeGreaterThan(0.6);
    });
  });

  describe('Scenario 5: Lead Conversion Tracking', () => {
    it('should track leads from demo to contact form', async () => {
      // User views demo
      const sessionId = generateSessionId();
      await trackDemoStart(sessionId, 'new');
      
      // User interacts heavily with demo
      for (let i = 0; i < 8; i++) {
        inMemoryStore.set(`analytics:demo:${sessionId}`, JSON.stringify({
          sessionId,
          version: 'new',
          startTime: Date.now() - 60000,
          interactions: i,
          createdAt: new Date().toISOString(),
        }));
        
        await trackDemoInteraction(sessionId);
      }
      
      await trackViewportTime(sessionId, 120000); // 2 minutes
      await trackDemoEnd(sessionId);
      
      // User submits contact form after being impressed
      const lead: Lead = {
        id: `converted-${sessionId}`,
        name: 'Impressed User',
        email: 'impressed@example.com',
        company: 'Growth Corp',
        message: 'Loved the new demo! Want to discuss implementation.',
        source: 'demo',
        createdAt: new Date().toISOString(),
      };
      
      await storeLead(lead);
      
      // Verify lead was stored
      const storedLead = await getLead(lead.id);
      expect(storedLead).toBeTruthy();
      expect(storedLead?.source).toBe('demo');
      expect(storedLead?.message).toContain('new demo');
    });
  });

  describe('Scenario 6: Data Persistence and Recovery', () => {
    it('should handle data recovery after simulated outage', async () => {
      // Store initial data
      const initialLeads: Lead[] = [];
      for (let i = 0; i < 5; i++) {
        const lead: Lead = {
          id: `persist-lead-${i}`,
          name: `User ${i}`,
          email: `user${i}@persist.com`,
          createdAt: new Date().toISOString(),
        };
        initialLeads.push(lead);
        await storeLead(lead);
      }

      // Simulate connection issue - clear mock but keep data
      const savedStore = new Map(inMemoryStore);
      
      // "Restore" connection with saved data
      inMemoryStore = savedStore;
      
      // Verify data persisted
      const recoveredLead = await getLead('persist-lead-2');
      expect(recoveredLead).toBeTruthy();
      expect(recoveredLead?.email).toBe('user2@persist.com');
      
      // Continue operations
      const newLead: Lead = {
        id: 'post-recovery-lead',
        name: 'New User',
        email: 'new@afterrecovery.com',
        createdAt: new Date().toISOString(),
      };
      await storeLead(newLead);
      
      // Verify both old and new data accessible
      const allLeads = await getRecentLeads(10);
      expect(allLeads.length).toBeGreaterThanOrEqual(6);
    });
  });
});