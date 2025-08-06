// Mock implementation of analytics module for testing

export const generateSessionId = jest.fn(() => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
});

export const trackDemoStart = jest.fn(async (sessionId: string, startView: 'old' | 'new') => {
  return {
    sessionId,
    startView,
    startTime: new Date().toISOString(),
    events: [],
  };
});

export const trackDemoEnd = jest.fn(async (sessionId: string, duration: number) => {
  return {
    sessionId,
    endTime: new Date().toISOString(),
    duration,
  };
});

export const trackDemoInteraction = jest.fn(async (sessionId: string, eventType: string, eventData?: unknown) => {
  return {
    sessionId,
    timestamp: new Date().toISOString(),
    eventType,
    eventData,
  };
});

export const trackViewportTime = jest.fn(async (sessionId: string, time: number) => {
  return {
    sessionId,
    viewportTime: time,
    timestamp: new Date().toISOString(),
  };
});

export const getAnalyticsSummary = jest.fn(async (timeRange?: { start: string; end: string }) => {
  return {
    totalSessions: 100,
    averageDuration: 45.5,
    conversionRate: 0.12,
    topInteractions: [
      { type: 'view_switch', count: 250 },
      { type: 'scroll', count: 180 },
      { type: 'click_cta', count: 45 },
    ],
    timeRange,
  };
});

export const compareVersionPerformance = jest.fn(async () => {
  return {
    oldVersion: {
      views: 450,
      averageTime: 25.3,
      bounceRate: 0.65,
    },
    newVersion: {
      views: 550,
      averageTime: 55.7,
      bounceRate: 0.22,
      improvement: '+120%',
    },
  };
});

export const trackPageView = jest.fn(async (page: string) => {
  return {
    page,
    timestamp: new Date().toISOString(),
  };
});

export const trackFormSubmission = jest.fn(async (formName: string, success: boolean) => {
  return {
    formName,
    success,
    timestamp: new Date().toISOString(),
  };
});