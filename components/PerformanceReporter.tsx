"use client";

import { useEffect } from 'react';

/**
 * Performance reporter component for monitoring demo section performance
 * Reports metrics to Chrome DevTools Performance API
 */
export function PerformanceReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    // Report Web Vitals
    const reportWebVitals = () => {
      // Report First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        console.log(`${entry.name}: ${entry.startTime}ms`);
      });

      // Report Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Report Long Tasks
      if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('longtask')) {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      }
    };

    // Run after a short delay to ensure page has loaded
    const timeoutId = setTimeout(reportWebVitals, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Component doesn't render anything
  return null;
}

/**
 * Hook to measure component render performance
 */
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    const measureName = `${componentName}-render`;

    // Mark render start
    performance.mark(startMark);

    return () => {
      // Mark render end and measure
      performance.mark(endMark);
      
      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        
        if (measure && measure.duration > 16.67) { // More than one frame
          console.warn(`${componentName} render took ${measure.duration.toFixed(2)}ms`);
        }
      } catch {
        // Ignore if marks don't exist
      }
    };
  }, [componentName]);
}