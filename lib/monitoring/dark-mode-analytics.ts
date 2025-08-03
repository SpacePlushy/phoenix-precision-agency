/**
 * Dark Mode Analytics and Monitoring
 * Tracks usage, performance, and errors for the dark mode feature
 */

import { analytics } from '../analytics';

export interface ThemeChangeEvent {
  theme: 'light' | 'dark' | 'system';
  previousTheme: 'light' | 'dark' | 'system';
  trigger: 'manual' | 'system' | 'initial';
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface ThemePerformanceMetrics {
  switchDuration: number; // Time to complete theme switch in ms
  renderTime: number; // Time to render after theme change
  hasFlash: boolean; // Whether FOUC was detected
}

export interface ThemeErrorEvent {
  error: string;
  errorType: 'storage' | 'api' | 'render';
  theme: string;
  timestamp: number;
  userAgent: string;
}

class DarkModeAnalytics {
  private sessionId: string;
  private switchStartTime: number | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Track theme change events
   */
  trackThemeChange(event: Omit<ThemeChangeEvent, 'timestamp' | 'sessionId'>) {
    const fullEvent: ThemeChangeEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // Send to analytics
    analytics.track('theme_changed', fullEvent);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Theme Analytics] Theme changed:', fullEvent);
    }
  }

  /**
   * Start measuring theme switch performance
   */
  startThemeSwitch() {
    this.switchStartTime = performance.now();
  }

  /**
   * Complete theme switch measurement and track performance
   */
  completeThemeSwitch(hasFlash = false) {
    if (!this.switchStartTime) return;

    const switchDuration = performance.now() - this.switchStartTime;
    const renderTime = this.measureRenderTime();

    const metrics: ThemePerformanceMetrics = {
      switchDuration,
      renderTime,
      hasFlash,
    };

    // Track performance metrics
    analytics.track('theme_performance', metrics);

    // Log warning if switch took too long
    if (switchDuration > 100) {
      console.warn(`[Theme Analytics] Slow theme switch detected: ${switchDuration}ms`);
    }

    this.switchStartTime = null;
  }

  /**
   * Track theme-related errors
   */
  trackError(error: Error | string, errorType: ThemeErrorEvent['errorType']) {
    const errorEvent: ThemeErrorEvent = {
      error: error instanceof Error ? error.message : error,
      errorType,
      theme: this.getCurrentTheme(),
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    };

    // Send to error tracking
    analytics.track('theme_error', errorEvent);

    // Log to console
    console.error('[Theme Analytics] Error:', errorEvent);
  }

  /**
   * Track theme preference persistence
   */
  trackPersistence(method: 'localStorage' | 'api', success: boolean, duration?: number) {
    analytics.track('theme_persistence', {
      method,
      success,
      duration,
      timestamp: Date.now(),
    });
  }

  /**
   * Track initial theme detection
   */
  trackInitialTheme(theme: string, source: 'system' | 'stored' | 'default') {
    analytics.track('theme_initial_load', {
      theme,
      source,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    });
  }

  /**
   * Get aggregated theme usage statistics
   */
  getThemeStats(): Promise<{
    darkModeUsers: number;
    lightModeUsers: number;
    systemPreferenceUsers: number;
    averageSwitchTime: number;
    errorRate: number;
  }> {
    // This would connect to your analytics backend
    // For now, return mock data
    return Promise.resolve({
      darkModeUsers: 0,
      lightModeUsers: 0,
      systemPreferenceUsers: 0,
      averageSwitchTime: 0,
      errorRate: 0,
    });
  }

  /**
   * Measure render time after theme change
   */
  private measureRenderTime(): number {
    // Use Performance Observer API if available
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const entries = performance.getEntriesByType('paint');
      const lastPaint = entries[entries.length - 1];
      return lastPaint ? lastPaint.startTime : 0;
    }
    return 0;
  }

  /**
   * Get current theme from DOM
   */
  private getCurrentTheme(): string {
    if (typeof document === 'undefined') return 'unknown';
    return document.documentElement.getAttribute('data-theme') || 
           document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const darkModeAnalytics = new DarkModeAnalytics();

// Export convenience functions
export const trackThemeChange = darkModeAnalytics.trackThemeChange.bind(darkModeAnalytics);
export const trackThemeError = darkModeAnalytics.trackError.bind(darkModeAnalytics);
export const trackThemePersistence = darkModeAnalytics.trackPersistence.bind(darkModeAnalytics);
export const startThemeSwitch = darkModeAnalytics.startThemeSwitch.bind(darkModeAnalytics);
export const completeThemeSwitch = darkModeAnalytics.completeThemeSwitch.bind(darkModeAnalytics);