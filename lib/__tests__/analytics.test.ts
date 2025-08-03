// Mock the upstash module before importing analytics
jest.mock('../upstash', () => ({
  storeDemoAnalytics: jest.fn(),
  updateDemoAnalytics: jest.fn(),
  getDemoAnalytics: jest.fn(),
  getDailyAnalytics: jest.fn(),
  getAnalyticsRange: jest.fn(),
}));

import {
  generateSessionId,
  trackDemoStart,
  trackDemoEnd,
  trackDemoInteraction,
  trackViewportTime,
  getAnalyticsForDate,
  getRecentAnalytics,
  getAnalyticsSummary,
  formatDuration,
  compareVersionPerformance,
} from '../analytics';
import * as upstash from '../upstash';
import type { DemoAnalytics, DailyAnalytics } from '../types';

describe('Analytics Module', () => {
  const mockUpstash = upstash as jest.Mocked<typeof upstash>;
  const mockDate = new Date('2025-08-02T10:00:00.000Z');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('generateSessionId', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();

      expect(id1).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^session_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('trackDemoStart', () => {
    it('should create initial analytics entry', async () => {
      const sessionId = 'test-session-123';
      
      await trackDemoStart(sessionId, 'new');

      expect(mockUpstash.storeDemoAnalytics).toHaveBeenCalledWith({
        sessionId,
        version: 'new',
        startTime: mockDate.getTime(),
        interactions: 0,
        createdAt: mockDate.toISOString(),
      });
    });
  });

  describe('trackDemoEnd', () => {
    it('should update analytics with end time', async () => {
      const sessionId = 'test-session-123';
      
      await trackDemoEnd(sessionId);

      expect(mockUpstash.updateDemoAnalytics).toHaveBeenCalledWith(sessionId, {
        endTime: mockDate.getTime(),
      });
    });
  });

  describe('trackDemoInteraction', () => {
    it('should increment interaction count', async () => {
      const sessionId = 'test-session-123';
      const existingAnalytics: DemoAnalytics = {
        sessionId,
        version: 'old',
        startTime: 1722590340000,
        interactions: 3,
        createdAt: '2025-08-02T09:59:00Z',
      };

      mockUpstash.getDemoAnalytics.mockResolvedValue(existingAnalytics);

      await trackDemoInteraction(sessionId);

      expect(mockUpstash.getDemoAnalytics).toHaveBeenCalledWith(sessionId);
      expect(mockUpstash.updateDemoAnalytics).toHaveBeenCalledWith(sessionId, {
        interactions: 4,
      });
    });

    it('should not update if analytics not found', async () => {
      mockUpstash.getDemoAnalytics.mockResolvedValue(null);

      await trackDemoInteraction('nonexistent');

      expect(mockUpstash.updateDemoAnalytics).not.toHaveBeenCalled();
    });
  });

  describe('trackViewportTime', () => {
    it('should update viewport time', async () => {
      const sessionId = 'test-session-123';
      
      await trackViewportTime(sessionId, 30000);

      expect(mockUpstash.updateDemoAnalytics).toHaveBeenCalledWith(sessionId, {
        viewportTime: 30000,
      });
    });
  });

  describe('getAnalyticsForDate', () => {
    it('should retrieve analytics for specific date', async () => {
      const mockData: DailyAnalytics = {
        date: '2025-08-02',
        totalViews: 100,
        oldVersionViews: 45,
        newVersionViews: 55,
        avgDuration: 60000,
        avgInteractions: 8,
        totalInteractions: 800,
        uniqueSessions: 100,
      };

      mockUpstash.getDailyAnalytics.mockResolvedValue(mockData);

      const result = await getAnalyticsForDate('2025-08-02');

      expect(mockUpstash.getDailyAnalytics).toHaveBeenCalledWith('2025-08-02');
      expect(result).toEqual(mockData);
    });
  });

  describe('getRecentAnalytics', () => {
    it('should get analytics for default 7 days', async () => {
      const mockData: DailyAnalytics[] = [
        {
          date: '2025-07-27',
          totalViews: 50,
          oldVersionViews: 20,
          newVersionViews: 30,
          avgDuration: 45000,
          avgInteractions: 5,
          totalInteractions: 250,
          uniqueSessions: 50,
        },
      ];

      mockUpstash.getAnalyticsRange.mockResolvedValue(mockData);

      const result = await getRecentAnalytics();

      const expectedEndDate = mockDate.toISOString().split('T')[0];
      const expectedStartDate = new Date(mockDate);
      expectedStartDate.setDate(expectedStartDate.getDate() - 6);
      
      expect(mockUpstash.getAnalyticsRange).toHaveBeenCalledWith(
        expectedStartDate.toISOString().split('T')[0],
        expectedEndDate
      );
      expect(result).toEqual(mockData);
    });

    it('should get analytics for custom days', async () => {
      mockUpstash.getAnalyticsRange.mockResolvedValue([]);

      await getRecentAnalytics(30);

      const expectedEndDate = mockDate.toISOString().split('T')[0];
      const expectedStartDate = new Date(mockDate);
      expectedStartDate.setDate(expectedStartDate.getDate() - 29);
      
      expect(mockUpstash.getAnalyticsRange).toHaveBeenCalledWith(
        expectedStartDate.toISOString().split('T')[0],
        expectedEndDate
      );
    });
  });

  describe('getAnalyticsSummary', () => {
    it('should return empty summary when no data', async () => {
      mockUpstash.getAnalyticsRange.mockResolvedValue([]);

      const result = await getAnalyticsSummary(7);

      expect(result).toEqual({
        totalViews: 0,
        oldVersionViews: 0,
        newVersionViews: 0,
        oldVersionPercentage: 0,
        newVersionPercentage: 0,
        avgDuration: 0,
        avgInteractions: 0,
        bestPerformingVersion: 'tie',
        dateRange: {
          start: mockDate.toISOString().split('T')[0],
          end: mockDate.toISOString().split('T')[0],
        },
      });
    });

    it('should calculate summary correctly', async () => {
      const mockData: DailyAnalytics[] = [
        {
          date: '2025-08-01',
          totalViews: 100,
          oldVersionViews: 40,
          newVersionViews: 60,
          avgDuration: 50000,
          avgInteractions: 6,
          totalInteractions: 600,
          uniqueSessions: 100,
        },
        {
          date: '2025-08-02',
          totalViews: 200,
          oldVersionViews: 60,
          newVersionViews: 140,
          avgDuration: 60000,
          avgInteractions: 8,
          totalInteractions: 1600,
          uniqueSessions: 200,
        },
      ];

      mockUpstash.getAnalyticsRange.mockResolvedValue(mockData);

      const result = await getAnalyticsSummary(2);

      expect(result).toEqual({
        totalViews: 300,
        oldVersionViews: 100,
        newVersionViews: 200,
        oldVersionPercentage: 33.33,
        newVersionPercentage: 66.67,
        avgDuration: 56666.666666666664, // weighted average
        avgInteractions: 7.333333333333333,
        bestPerformingVersion: 'new', // new has >5% more
        dateRange: {
          start: '2025-08-01',
          end: '2025-08-02',
        },
      });
    });

    it('should determine tie when versions are close', async () => {
      const mockData: DailyAnalytics[] = [
        {
          date: '2025-08-01',
          totalViews: 100,
          oldVersionViews: 48,
          newVersionViews: 52,
          avgDuration: 50000,
          avgInteractions: 6,
          totalInteractions: 600,
          uniqueSessions: 100,
        },
      ];

      mockUpstash.getAnalyticsRange.mockResolvedValue(mockData);

      const result = await getAnalyticsSummary(1);

      expect(result.bestPerformingVersion).toBe('tie');
    });
  });

  describe('formatDuration', () => {
    it('should format seconds only', () => {
      expect(formatDuration(5000)).toBe('5s');
      expect(formatDuration(45000)).toBe('45s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(65000)).toBe('1m 5s');
      expect(formatDuration(125000)).toBe('2m 5s');
    });

    it('should handle edge cases', () => {
      expect(formatDuration(0)).toBe('0s');
      expect(formatDuration(60000)).toBe('1m 0s');
    });
  });

  describe('compareVersionPerformance', () => {
    it('should compare version performance with confidence', async () => {
      const mockData: DailyAnalytics[] = [
        {
          date: '2025-08-01',
          totalViews: 200,
          oldVersionViews: 50,
          newVersionViews: 150,
          avgDuration: 60000,
          avgInteractions: 10,
          totalInteractions: 2000,
          uniqueSessions: 200,
        },
      ];

      mockUpstash.getAnalyticsRange.mockResolvedValue(mockData);

      const result = await compareVersionPerformance(1);

      // The calculation is based on the total views and proportional distribution
      // With 200 total views (50 old, 150 new), duration 60000, interactions 10
      // Old version gets 50/200 = 0.25 share
      // New version gets 150/200 = 0.75 share
      expect(result.oldVersion.views).toBe(50);
      expect(result.newVersion.views).toBe(150);
      
      // Both versions should have the same average duration and interactions
      // because the mock data has a single aggregate value
      expect(result.oldVersion.avgDuration).toBe(60000);
      expect(result.newVersion.avgDuration).toBe(60000);
      expect(result.oldVersion.avgInteractions).toBeCloseTo(2.5, 1);
      expect(result.newVersion.avgInteractions).toBeCloseTo(7.5, 1);
      
      expect(result.oldVersion.engagementScore).toBeDefined();
      expect(result.newVersion.engagementScore).toBeDefined();
      expect(result.winner).toBeDefined();
      expect(result.confidence).toBeDefined();

      // New version should have higher engagement
      expect(result.newVersion.engagementScore).toBeGreaterThan(
        result.oldVersion.engagementScore
      );
    });

    it('should reduce confidence for small sample sizes', async () => {
      const mockData: DailyAnalytics[] = [
        {
          date: '2025-08-01',
          totalViews: 10,
          oldVersionViews: 3,
          newVersionViews: 7,
          avgDuration: 30000,
          avgInteractions: 5,
          totalInteractions: 50,
          uniqueSessions: 10,
        },
      ];

      mockUpstash.getAnalyticsRange.mockResolvedValue(mockData);

      const result = await compareVersionPerformance(1);

      // With only 10 total views, confidence should be low
      expect(result.confidence).toBeLessThan(20);
    });

    it('should handle no data gracefully', async () => {
      mockUpstash.getAnalyticsRange.mockResolvedValue([]);

      const result = await compareVersionPerformance(7);

      expect(result).toEqual({
        oldVersion: {
          views: 0,
          avgDuration: 0,
          avgInteractions: 0,
          engagementScore: 0,
        },
        newVersion: {
          views: 0,
          avgDuration: 0,
          avgInteractions: 0,
          engagementScore: 0,
        },
        winner: 'tie',
        confidence: 0,
      });
    });
  });
});