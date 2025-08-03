# Analytics Setup Guide

## Overview

This application uses multiple analytics solutions:

1. **Custom Demo Analytics** - Tracks demo interactions using Upstash Redis
2. **Vercel Analytics** - General website analytics (automatically enabled on Vercel)
3. **Google Analytics** (optional) - Additional tracking capabilities

## 1. Custom Demo Analytics (Redis-based)

### Environment Variables Required:
```env
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token_here
```

### Features:
- Tracks demo session starts/ends
- Records user interactions with demo views
- Measures viewport time
- Stores daily analytics aggregates

### Implementation:
- Analytics functions are in `/lib/analytics.ts`
- Integrated in `/components/demo/DemoContainer.tsx`
- Data stored in Upstash Redis

## 2. Vercel Analytics

### Setup:
1. **Automatic**: Analytics are automatically enabled when deployed to Vercel
2. **No configuration needed**: The `@vercel/analytics` package is already installed
3. **View data**: Access analytics at https://vercel.com/[your-team]/[your-project]/analytics

### Features:
- Page views
- Unique visitors
- Top pages
- Top referrers
- Device/browser breakdown
- Geographic data

## 3. Google Analytics (Optional)

To add Google Analytics:

### Step 1: Get your Measurement ID
1. Go to Google Analytics
2. Create a new property or use existing
3. Copy the Measurement ID (format: G-XXXXXXXXXX)

### Step 2: Add Environment Variable
Add to `.env.local`:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 3: Add Google Analytics Component
Create `/components/GoogleAnalytics.tsx`:
```tsx
'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  
  if (!GA_MEASUREMENT_ID) return null;
  
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
```

### Step 4: Add to Layout
Add to your root layout or marketing layout:
```tsx
import GoogleAnalytics from '@/components/GoogleAnalytics';

// In the layout component
<GoogleAnalytics />
```

## Vercel Deployment Checklist

1. **Environment Variables**: Add all required env vars in Vercel dashboard:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

2. **Verify Analytics**:
   - Custom demo analytics: Check Redis for stored data
   - Vercel Analytics: Check dashboard at vercel.com
   - Google Analytics: Check real-time view in GA dashboard

## Troubleshooting

### Analytics not working?

1. **Check Environment Variables**:
   ```bash
   # Local
   cat .env.local
   
   # Vercel
   vercel env ls
   ```

2. **Check Browser Console**:
   - Look for network requests to analytics endpoints
   - Check for JavaScript errors

3. **Verify Redis Connection**:
   - Test with the example usage in `/lib/example-usage.ts`
   - Check Upstash dashboard for connection logs

4. **Vercel Analytics**:
   - Ensure you're on a Pro plan or trial
   - Check if analytics is enabled in project settings

5. **Content Security Policy**:
   - If using CSP headers, ensure analytics domains are allowed
   - Add to `next.config.js` if needed:
   ```js
   const ContentSecurityPolicy = `
     script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-analytics.com *.google-analytics.com *.googletagmanager.com;
     connect-src 'self' *.vercel-analytics.com *.google-analytics.com *.googletagmanager.com;
   `;
   ```

## Testing Analytics Locally

1. **Custom Demo Analytics**:
   ```bash
   pnpm dev
   # Open browser, interact with demo
   # Check console for analytics calls
   ```

2. **Vercel Analytics**:
   - Works only in production (Vercel deployment)
   - Use `vercel dev` for closer production parity

3. **Google Analytics**:
   - Install Google Analytics Debugger Chrome extension
   - Check real-time reports in GA dashboard