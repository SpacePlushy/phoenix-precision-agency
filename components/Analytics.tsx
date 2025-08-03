'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Log when analytics is loaded in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Vercel Analytics component mounted');
    }
  }, []);

  // Always render analytics for MVP demonstration
  // This ensures analytics is available on Vercel deployment

  return (
    <VercelAnalytics
      // Prevent analytics from blocking page load
      beforeSend={(event) => {
        // Filter out any sensitive data
        if (event.url.includes('/admin') || event.url.includes('/api/')) {
          return null;
        }
        return event;
      }}
    />
  );
}