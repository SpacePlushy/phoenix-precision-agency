// Redis data structure types

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: 'contact' | 'demo';
  createdAt: string;
}

export interface DemoAnalytics {
  sessionId: string;
  version: 'old' | 'new';
  startTime: number;
  endTime?: number;
  duration?: number; // in milliseconds
  interactions: number;
  viewportTime?: number; // time element was in viewport
  createdAt: string;
}

export interface DailyAnalytics {
  date: string; // YYYY-MM-DD format
  totalViews: number;
  oldVersionViews: number;
  newVersionViews: number;
  avgDuration: number; // in milliseconds
  avgInteractions: number;
  totalInteractions: number;
  uniqueSessions: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface StorageKeys {
  lead: (id: string) => string;
  leadsList: string;
  demoAnalytics: (sessionId: string) => string;
  dailyAnalytics: (date: string) => string;
  rateLimit: (identifier: string) => string;
}