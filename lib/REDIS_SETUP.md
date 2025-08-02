# Upstash Redis Setup and Usage Guide

This document explains how to set up and use the Upstash Redis configuration for the Phoenix Precision Agency site.

## Prerequisites

1. Create an Upstash account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Get your REST URL and REST Token from the Upstash console

## Environment Variables

Add these to your `.env.local` file:

```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

## Features

### 1. Lead Management
- Store leads with 30-day automatic expiration
- Retrieve individual leads or recent leads
- Automatic deduplication by lead ID

### 2. Demo Analytics
- Track user sessions on old vs new demo versions
- Monitor interaction counts and time spent
- Calculate engagement scores
- Compare version performance with statistical confidence

### 3. Rate Limiting
- Prevent spam and abuse
- 10 requests per minute sliding window
- Per-IP or per-email rate limiting

### 4. Daily Analytics Aggregation
- Automatic daily rollups
- 180-day retention for analytics data
- Performance metrics tracking

## Usage Examples

### Storing a Lead

```typescript
import { storeLead } from '@/lib/upstash';
import type { Lead } from '@/lib/types';

const lead: Lead = {
  id: `lead-${Date.now()}`,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  company: 'Acme Corp',
  message: 'Interested in your services',
  source: 'contact',
  createdAt: new Date().toISOString(),
};

await storeLead(lead);
```

### Tracking Demo Analytics

```typescript
import { 
  generateSessionId,
  trackDemoStart,
  trackDemoInteraction,
  trackDemoEnd 
} from '@/lib/analytics';

// Start tracking
const sessionId = generateSessionId();
await trackDemoStart(sessionId, 'new');

// Track interactions
await trackDemoInteraction(sessionId);

// End tracking
await trackDemoEnd(sessionId);
```

### Rate Limiting in API Routes

```typescript
import { rateLimiter } from '@/lib/upstash';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success, remaining } = await rateLimiter.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
  
  // Process request...
}
```

### Getting Analytics Summary

```typescript
import { getAnalyticsSummary, compareVersionPerformance } from '@/lib/analytics';

// Get 30-day summary
const summary = await getAnalyticsSummary(30);
console.log(`Total views: ${summary.totalViews}`);
console.log(`Best performing: ${summary.bestPerformingVersion}`);

// Compare versions
const comparison = await compareVersionPerformance(30);
if (comparison.winner === 'new' && comparison.confidence > 75) {
  console.log('New version is significantly better!');
}
```

## Data Structures

### Lead
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: 'contact' | 'demo';
  createdAt: string;
}
```

### Demo Analytics
```typescript
interface DemoAnalytics {
  sessionId: string;
  version: 'old' | 'new';
  startTime: number;
  endTime?: number;
  duration?: number;
  interactions: number;
  viewportTime?: number;
  createdAt: string;
}
```

### Daily Analytics
```typescript
interface DailyAnalytics {
  date: string;
  totalViews: number;
  oldVersionViews: number;
  newVersionViews: number;
  avgDuration: number;
  avgInteractions: number;
  totalInteractions: number;
  uniqueSessions: number;
}
```

## Storage Keys

The system uses the following key patterns:

- Leads: `lead:{id}` (30-day TTL)
- Leads list: `leads:list` (sorted set)
- Demo analytics: `analytics:demo:{sessionId}` (90-day TTL)
- Daily analytics: `analytics:daily:{YYYY-MM-DD}` (180-day TTL)
- Rate limits: `@upstash/ratelimit:{identifier}`

## Best Practices

1. **Error Handling**: Always wrap Redis operations in try-catch blocks
2. **Batching**: Use pipelines for multiple operations
3. **TTL Management**: Data automatically expires based on configured TTLs
4. **Rate Limiting**: Apply rate limits at the API route level
5. **Analytics**: Track meaningful interactions, not every mouse movement

## Monitoring

Monitor your Redis usage in the Upstash console:
- Request count
- Data usage
- Hit/miss ratio
- Latency metrics

## Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check Upstash dashboard for service status
- Ensure your Redis database is active

### Rate Limit Issues
- Adjust the rate limit configuration if needed
- Consider different rate limit strategies per endpoint
- Monitor for false positives

### Data Not Persisting
- Check TTL settings
- Verify write operations complete successfully
- Monitor Redis memory usage

## Testing

The codebase includes comprehensive tests:
- Unit tests for all functions
- Integration tests for workflows
- Acceptance tests for real-world scenarios

Run tests with: `npm test lib/__tests__/`