import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/upstash';
import crypto from 'crypto';

/**
 * Enhanced rate limiting with IP extraction and fingerprinting
 * Implements defense against IP spoofing and distributed attacks
 */

/**
 * Extract real IP address with anti-spoofing measures
 * Follows Vercel's recommended approach for edge runtime
 */
export function getClientIP(request: NextRequest): string {
  // For Vercel deployment, use their recommended approach
  if (process.env.VERCEL) {
    // Vercel provides the real IP in specific headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      // Take the first IP in the chain (original client)
      return forwardedFor.split(',')[0].trim();
    }
  }
  
  // For local development or other environments
  if (process.env.NODE_ENV === 'development') {
    return '127.0.0.1';
  }
  
  // Fallback to x-real-ip or connection info
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // If behind a trusted proxy (configure via env)
  if (process.env.TRUSTED_PROXY === 'true') {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      // Extract the client IP (first in chain)
      const ips = forwarded.split(',').map(ip => ip.trim());
      return ips[0];
    }
  }
  
  // Last resort - use a hash of headers for consistency
  return generateIPFallback(request);
}

/**
 * Generate a consistent identifier when IP is not available
 * Uses a combination of headers to create a fingerprint
 */
function generateIPFallback(request: NextRequest): string {
  const fingerprint = [
    request.headers.get('user-agent') || '',
    request.headers.get('accept-language') || '',
    request.headers.get('accept-encoding') || '',
    request.headers.get('sec-ch-ua') || '',
  ].join('|');
  
  // Create a hash of the fingerprint
  return 'fp_' + crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 16);
}

/**
 * Enhanced rate limiter with multiple strategies
 */
export interface RateLimitConfig {
  requests: number;
  window: string;
  identifier?: string;
}

export class EnhancedRateLimiter {
  private limiter: Ratelimit | null;
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig) {
    this.config = config;
    
    if (redis) {
      this.limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.requests, config.window as any),
        analytics: true,
        prefix: `@upstash/ratelimit/${config.identifier || 'default'}`,
      });
    } else {
      this.limiter = null;
    }
  }
  
  /**
   * Check rate limit for a request
   */
  async limit(request: NextRequest): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    headers: Record<string, string>;
  }> {
    if (!this.limiter) {
      // If Redis not configured, allow all requests (development mode)
      return {
        success: true,
        limit: this.config.requests,
        remaining: this.config.requests,
        reset: Date.now() + 60000,
        headers: {},
      };
    }
    
    const identifier = getClientIP(request);
    const result = await this.limiter.limit(identifier);
    
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.reset).toISOString(),
    };
    
    // Add retry-after header when rate limited
    if (!result.success) {
      const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
      headers['Retry-After'] = retryAfter.toString();
    }
    
    return {
      ...result,
      headers,
    };
  }
  
  /**
   * Reset rate limit for a specific identifier
   */
  async reset(request: NextRequest): Promise<void> {
    if (!redis) return;
    
    const identifier = getClientIP(request);
    const key = `${this.config.identifier || 'default'}:${identifier}`;
    await redis.del(key);
  }
}

/**
 * Pre-configured rate limiters for different endpoints
 */
export const rateLimiters = {
  // Contact form: 3 requests per hour
  contact: new EnhancedRateLimiter({
    requests: 3,
    window: '1 h',
    identifier: 'contact',
  }),
  
  // API general: 100 requests per minute
  api: new EnhancedRateLimiter({
    requests: 100,
    window: '1 m',
    identifier: 'api',
  }),
  
  // Analytics: 1000 requests per hour
  analytics: new EnhancedRateLimiter({
    requests: 1000,
    window: '1 h',
    identifier: 'analytics',
  }),
  
  // Strict: 10 requests per 10 minutes (for sensitive operations)
  strict: new EnhancedRateLimiter({
    requests: 10,
    window: '10 m',
    identifier: 'strict',
  }),
};

/**
 * Middleware helper for rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  limiter: EnhancedRateLimiter
): Promise<Response | null> {
  const { success, headers } = await limiter.limit(request);
  
  if (!success) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  }
  
  return null; // Continue processing
}

/**
 * Distributed attack detection
 * Monitors for patterns indicating coordinated attacks
 */
export class AttackDetector {
  private static readonly THRESHOLD = 50; // Requests in window
  private static readonly WINDOW = 60000; // 1 minute
  
  static async checkForAttack(identifier: string): Promise<boolean> {
    if (!redis) return false;
    
    const key = `attack_detection:${identifier}`;
    const count = await redis.incr(key);
    
    if (count === 1) {
      // Set expiry on first increment
      await redis.expire(key, 60);
    }
    
    return count > this.THRESHOLD;
  }
  
  static async blockIdentifier(identifier: string, duration: number = 3600): Promise<void> {
    if (!redis) return;
    
    const key = `blocked:${identifier}`;
    await redis.setex(key, duration, '1');
  }
  
  static async isBlocked(identifier: string): Promise<boolean> {
    if (!redis) return false;
    
    const key = `blocked:${identifier}`;
    const blocked = await redis.get(key);
    return blocked === '1';
  }
}