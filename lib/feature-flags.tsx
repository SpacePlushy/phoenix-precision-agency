/**
 * Feature Flags Configuration
 * Manages feature toggles for gradual rollouts and A/B testing
 */

import React, { useState, useEffect } from 'react';
import { redis } from './upstash';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  enabledForUsers?: string[];
  disabledForUsers?: string[];
  metadata?: Record<string, unknown>;
}

export interface FeatureFlagConfig {
  darkMode: FeatureFlag;
  // Add more feature flags as needed
}

/**
 * Default feature flag configuration
 */
const defaultFlags: FeatureFlagConfig = {
  darkMode: {
    key: 'dark-mode',
    enabled: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true' || true,
    rolloutPercentage: 100, // 100% rollout by default
    metadata: {
      description: 'Dark mode theme support',
      since: '2025-08-03',
      components: ['theme-toggle', 'theme-provider'],
    },
  },
};

class FeatureFlagManager {
  private flags: FeatureFlagConfig;
  private redisPrefix = 'feature-flag:';

  constructor() {
    this.flags = { ...defaultFlags };
  }

  /**
   * Check if a feature is enabled for a specific user
   */
  async isEnabled(
    flagKey: keyof FeatureFlagConfig,
    userId?: string
  ): Promise<boolean> {
    const flag = this.flags[flagKey];
    
    if (!flag || !flag.enabled) {
      return false;
    }

    // Check user-specific overrides
    if (userId) {
      // Check if user is explicitly disabled
      if (flag.disabledForUsers?.includes(userId)) {
        return false;
      }

      // Check if user is explicitly enabled
      if (flag.enabledForUsers?.includes(userId)) {
        return true;
      }

      // Check Redis for dynamic overrides
      try {
        if (redis) {
          const override = await redis.get(`${this.redisPrefix}${flag.key}:${userId}`);
          if (override !== null) {
            return override === 'true';
          }
        }
      } catch (error) {
        console.error('[Feature Flags] Redis error:', error);
      }
    }

    // Check rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      return this.isInRolloutPercentage(userId || 'anonymous', flag.rolloutPercentage);
    }

    return true;
  }

  /**
   * Enable a feature for a specific user
   */
  async enableForUser(flagKey: keyof FeatureFlagConfig, userId: string): Promise<void> {
    const flag = this.flags[flagKey];
    if (!flag) return;

    try {
      if (redis) {
        await redis.set(
          `${this.redisPrefix}${flag.key}:${userId}`,
          'true',
          { ex: 30 * 24 * 60 * 60 } // 30 days
        );
      }
    } catch (error) {
      console.error('[Feature Flags] Failed to enable for user:', error);
    }
  }

  /**
   * Disable a feature for a specific user
   */
  async disableForUser(flagKey: keyof FeatureFlagConfig, userId: string): Promise<void> {
    const flag = this.flags[flagKey];
    if (!flag) return;

    try {
      if (redis) {
        await redis.set(
          `${this.redisPrefix}${flag.key}:${userId}`,
          'false',
          { ex: 30 * 24 * 60 * 60 } // 30 days
        );
      }
    } catch (error) {
      console.error('[Feature Flags] Failed to disable for user:', error);
    }
  }

  /**
   * Get all feature flags for a user
   */
  async getAllFlags(userId?: string): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};

    for (const [key] of Object.entries(this.flags)) {
      result[key] = await this.isEnabled(key as keyof FeatureFlagConfig, userId);
    }

    return result;
  }

  /**
   * Update rollout percentage for a feature
   */
  updateRolloutPercentage(flagKey: keyof FeatureFlagConfig, percentage: number): void {
    const flag = this.flags[flagKey];
    if (flag) {
      flag.rolloutPercentage = Math.max(0, Math.min(100, percentage));
    }
  }

  /**
   * Check if a user is in the rollout percentage
   */
  private isInRolloutPercentage(identifier: string, percentage: number): boolean {
    // Simple hash-based distribution
    const hash = this.hashString(identifier);
    const bucket = hash % 100;
    return bucket < percentage;
  }

  /**
   * Simple string hash function
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

// Export singleton instance
export const featureFlags = new FeatureFlagManager();

// Export convenience functions
export async function isDarkModeEnabled(userId?: string): Promise<boolean> {
  return featureFlags.isEnabled('darkMode', userId);
}

// React hook for feature flags
export function useFeatureFlag(flagKey: keyof FeatureFlagConfig, userId?: string) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    featureFlags.isEnabled(flagKey, userId)
      .then(setEnabled)
      .finally(() => setLoading(false));
  }, [flagKey, userId]);

  return { enabled, loading };
}

// HOC for feature flags
export function withFeatureFlag<P extends object>(
  Component: React.ComponentType<P>,
  flagKey: keyof FeatureFlagConfig,
  FallbackComponent?: React.ComponentType<P>
) {
  return function FeatureFlaggedComponent(props: P) {
    const { enabled, loading } = useFeatureFlag(flagKey);

    if (loading) {
      return null; // Or a loading component
    }

    if (!enabled && FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return enabled ? <Component {...props} /> : null;
  };
}

