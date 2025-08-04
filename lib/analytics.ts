import { storeDemoAnalytics, getDemoAnalytics, updateDemoAnalytics, getDailyAnalytics, getAnalyticsRange } from './upstash';
import type { DemoAnalytics, DailyAnalytics } from './types';

// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Validate session ID format
function isValidSessionId(sessionId: string | null | undefined): boolean {
  if (!sessionId || typeof sessionId !== 'string') return false;
  return sessionId.startsWith('session_') && sessionId.length > 10;
}

// Track when a user starts viewing the demo
export async function trackDemoStart(
  sessionId: string,
  version: 'old' | 'new'
): Promise<void> {
  if (!isValidSessionId(sessionId)) {
    return;
  }
  
  try {
    const analytics: DemoAnalytics = {
      sessionId,
      version,
      startTime: Date.now(),
      interactions: 0,
      createdAt: new Date().toISOString(),
    };
    
    await storeDemoAnalytics(analytics);
  } catch (_error) {
    // Silently fail if Redis is unavailable
  }
}

// Track when a user stops viewing the demo
export async function trackDemoEnd(sessionId: string): Promise<void> {
  if (!isValidSessionId(sessionId)) {
    return;
  }
  
  try {
    await updateDemoAnalytics(sessionId, {
      endTime: Date.now(),
    });
  } catch (_error) {
    // Silently fail if Redis is unavailable
  }
}

// Track user interactions with the demo
export async function trackDemoInteraction(sessionId: string): Promise<void> {
  if (!isValidSessionId(sessionId)) {
    return;
  }
  
  try {
    const existing = await getDemoAnalytics(sessionId);
    
    if (existing) {
      await updateDemoAnalytics(sessionId, {
        interactions: existing.interactions + 1,
      });
    }
  } catch (_error) {
    // Silently fail if Redis is unavailable
  }
}

// Track viewport time (how long the demo was actually visible)
export async function trackViewportTime(
  sessionId: string,
  viewportTime: number
): Promise<void> {
  if (!isValidSessionId(sessionId) || viewportTime < 0) {
    return;
  }
  
  try {
    await updateDemoAnalytics(sessionId, {
      viewportTime,
    });
  } catch (_error) {
    // Silently fail if Redis is unavailable
  }
}

// Get analytics for a specific date
export async function getAnalyticsForDate(date: string): Promise<DailyAnalytics | null> {
  return await getDailyAnalytics(date);
}

// Get analytics for the last N days
export async function getRecentAnalytics(days: number = 7): Promise<DailyAnalytics[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  
  return await getAnalyticsRange(startStr, endStr);
}

// Get analytics summary
export interface AnalyticsSummary {
  totalViews: number;
  oldVersionViews: number;
  newVersionViews: number;
  oldVersionPercentage: number;
  newVersionPercentage: number;
  avgDuration: number;
  avgInteractions: number;
  bestPerformingVersion: 'old' | 'new' | 'tie';
  dateRange: {
    start: string;
    end: string;
  };
}

export async function getAnalyticsSummary(days: number = 30): Promise<AnalyticsSummary> {
  const analytics = await getRecentAnalytics(days);
  
  if (analytics.length === 0) {
    return {
      totalViews: 0,
      oldVersionViews: 0,
      newVersionViews: 0,
      oldVersionPercentage: 0,
      newVersionPercentage: 0,
      avgDuration: 0,
      avgInteractions: 0,
      bestPerformingVersion: 'tie',
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
    };
  }
  
  const summary = analytics.reduce(
    (acc, day) => ({
      totalViews: acc.totalViews + day.totalViews,
      oldVersionViews: acc.oldVersionViews + day.oldVersionViews,
      newVersionViews: acc.newVersionViews + day.newVersionViews,
      totalDuration: acc.totalDuration + (day.avgDuration * day.totalViews),
      totalInteractions: acc.totalInteractions + day.totalInteractions,
    }),
    {
      totalViews: 0,
      oldVersionViews: 0,
      newVersionViews: 0,
      totalDuration: 0,
      totalInteractions: 0,
    }
  );
  
  const oldPercentage = summary.totalViews > 0
    ? (summary.oldVersionViews / summary.totalViews) * 100
    : 0;
    
  const newPercentage = summary.totalViews > 0
    ? (summary.newVersionViews / summary.totalViews) * 100
    : 0;
  
  let bestPerformingVersion: 'old' | 'new' | 'tie' = 'tie';
  if (oldPercentage > newPercentage + 5) {
    bestPerformingVersion = 'old';
  } else if (newPercentage > oldPercentage + 5) {
    bestPerformingVersion = 'new';
  }
  
  return {
    totalViews: summary.totalViews,
    oldVersionViews: summary.oldVersionViews,
    newVersionViews: summary.newVersionViews,
    oldVersionPercentage: Math.round(oldPercentage * 100) / 100,
    newVersionPercentage: Math.round(newPercentage * 100) / 100,
    avgDuration: summary.totalViews > 0 ? summary.totalDuration / summary.totalViews : 0,
    avgInteractions: summary.totalViews > 0 ? summary.totalInteractions / summary.totalViews : 0,
    bestPerformingVersion,
    dateRange: {
      start: analytics[0].date,
      end: analytics[analytics.length - 1].date,
    },
  };
}

// Helper to format duration for display
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  return `${seconds}s`;
}

// Compare version performance
export interface VersionComparison {
  oldVersion: {
    views: number;
    avgDuration: number;
    avgInteractions: number;
    engagementScore: number;
  };
  newVersion: {
    views: number;
    avgDuration: number;
    avgInteractions: number;
    engagementScore: number;
  };
  winner: 'old' | 'new' | 'tie';
  confidence: number; // 0-100
}

export async function compareVersionPerformance(days: number = 30): Promise<VersionComparison> {
  const analytics = await getRecentAnalytics(days);
  
  const versionStats = analytics.reduce(
    (acc, day) => {
      // Old version stats
      if (day.oldVersionViews > 0) {
        acc.old.views += day.oldVersionViews;
        acc.old.totalDuration += day.avgDuration * day.oldVersionViews;
        acc.old.totalInteractions += day.totalInteractions * (day.oldVersionViews / day.totalViews);
      }
      
      // New version stats
      if (day.newVersionViews > 0) {
        acc.new.views += day.newVersionViews;
        acc.new.totalDuration += day.avgDuration * day.newVersionViews;
        acc.new.totalInteractions += day.totalInteractions * (day.newVersionViews / day.totalViews);
      }
      
      return acc;
    },
    {
      old: { views: 0, totalDuration: 0, totalInteractions: 0 },
      new: { views: 0, totalDuration: 0, totalInteractions: 0 },
    }
  );
  
  const oldAvgDuration = versionStats.old.views > 0
    ? versionStats.old.totalDuration / versionStats.old.views
    : 0;
    
  const oldAvgInteractions = versionStats.old.views > 0
    ? versionStats.old.totalInteractions / versionStats.old.views
    : 0;
    
  const newAvgDuration = versionStats.new.views > 0
    ? versionStats.new.totalDuration / versionStats.new.views
    : 0;
    
  const newAvgInteractions = versionStats.new.views > 0
    ? versionStats.new.totalInteractions / versionStats.new.views
    : 0;
  
  // Calculate engagement scores (higher is better)
  const oldEngagement = calculateEngagementScore(oldAvgDuration, oldAvgInteractions);
  const newEngagement = calculateEngagementScore(newAvgDuration, newAvgInteractions);
  
  // Determine winner
  let winner: 'old' | 'new' | 'tie' = 'tie';
  let confidence = 0;
  
  const engagementDiff = Math.abs(oldEngagement - newEngagement);
  
  if (engagementDiff > 5) {
    winner = oldEngagement > newEngagement ? 'old' : 'new';
    confidence = Math.min(engagementDiff * 2, 100);
  }
  
  // Adjust confidence based on sample size
  const totalViews = versionStats.old.views + versionStats.new.views;
  if (totalViews < 100) {
    confidence = confidence * (totalViews / 100);
  }
  
  return {
    oldVersion: {
      views: versionStats.old.views,
      avgDuration: oldAvgDuration,
      avgInteractions: oldAvgInteractions,
      engagementScore: oldEngagement,
    },
    newVersion: {
      views: versionStats.new.views,
      avgDuration: newAvgDuration,
      avgInteractions: newAvgInteractions,
      engagementScore: newEngagement,
    },
    winner,
    confidence: Math.round(confidence),
  };
}

// Calculate engagement score (0-100)
function calculateEngagementScore(duration: number, interactions: number): number {
  // Normalize duration (assume 30 seconds is good, 2 minutes is excellent)
  const durationScore = Math.min((duration / 120000) * 50, 50);
  
  // Normalize interactions (assume 5 interactions is good, 10+ is excellent)
  const interactionScore = Math.min((interactions / 10) * 50, 50);
  
  return Math.round(durationScore + interactionScore);
}