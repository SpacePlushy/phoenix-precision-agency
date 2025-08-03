/**
 * Analytics Service for Vercel Analytics Integration
 * Provides a unified interface for tracking events across the application
 * 
 * Note: To use Vercel Analytics, install @vercel/analytics package:
 * pnpm add @vercel/analytics
 */

export interface AnalyticsEvent {
  [key: string]: any;
}

export interface AnalyticsService {
  track(event: string, data?: AnalyticsEvent): void;
  identify(userId: string, traits?: AnalyticsEvent): void;
  page(name?: string, properties?: AnalyticsEvent): void;
}

class BaseAnalyticsService implements AnalyticsService {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Track a custom event
   * 
   * In production with Vercel Analytics installed:
   * import { track as vercelTrack } from '@vercel/analytics';
   * vercelTrack(event, data);
   */
  track(event: string, data?: AnalyticsEvent): void {
    // In development, log to console
    if (this.isDevelopment) {
      console.log(`[Analytics] Event: ${event}`, data);
    }

    // Check if Vercel Analytics is available
    if (typeof window !== 'undefined' && 'va' in window) {
      // Vercel Analytics is loaded
      try {
        // @ts-ignore - va is injected by Vercel Analytics
        window.va('event', { name: event, data });
      } catch (error) {
        console.error('[Analytics] Error tracking event:', error);
      }
    }
    
    // Fallback: Store in localStorage for debugging
    if (typeof window !== 'undefined') {
      try {
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push({
          event,
          data,
          timestamp: new Date().toISOString(),
        });
        // Keep only last 100 events
        if (events.length > 100) {
          events.splice(0, events.length - 100);
        }
        localStorage.setItem('analytics_events', JSON.stringify(events));
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string, traits?: AnalyticsEvent): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Identify: ${userId}`, traits);
    }

    // Store user identification for future events
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('analytics_user_id', userId);
        if (traits) {
          localStorage.setItem('analytics_user_traits', JSON.stringify(traits));
        }
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Track a page view
   */
  page(name?: string, properties?: AnalyticsEvent): void {
    if (this.isDevelopment) {
      console.log(`[Analytics] Page: ${name || 'Unknown'}`, properties);
    }

    // Vercel Analytics automatically tracks page views
    // This method is here for compatibility with other analytics services
  }
}

// Export singleton instance
export const analytics = new BaseAnalyticsService();

// Export type for extension
export type { BaseAnalyticsService };