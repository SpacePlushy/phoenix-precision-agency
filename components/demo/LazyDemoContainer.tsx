"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the DemoContainer with code splitting
const DemoContainer = dynamic(
  () => import('./DemoContainer'),
  {
    loading: () => <DemoContainerSkeleton />,
    ssr: false // Disable SSR for animation-heavy component
  }
);

// Loading skeleton that matches the demo section's structure
function DemoContainerSkeleton() {
  return (
    <section className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <Skeleton className="h-12 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        </div>
        
        <div className="mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-2 flex-1 mx-6" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        
        <div className="hidden lg:grid grid-cols-2 gap-12">
          <Skeleton className="h-[600px] rounded-xl" />
          <Skeleton className="h-[600px] rounded-xl" />
        </div>
        
        <div className="lg:hidden">
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    </section>
  );
}

// Custom hook for intersection observer with Chrome optimizations
function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLDivElement>(null);
  const hasIntersected = useRef(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Chrome-specific optimization: reduce observer overhead
    const observerOptions = {
      root: null,
      rootMargin: '50px', // Start loading slightly before element is visible
      threshold: 0.1,
      ...options
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasIntersected.current) {
          hasIntersected.current = true;
          callback();
          observer.disconnect(); // Stop observing after first intersection
        }
      });
    }, observerOptions);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return targetRef;
}

export default function LazyDemoContainer() {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  // Use intersection observer to trigger loading
  const containerRef = useIntersectionObserver(() => {
    // Use requestIdleCallback for non-critical loading in Chrome
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setShouldLoad(true), { timeout: 1000 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      requestAnimationFrame(() => setShouldLoad(true));
    }
  });

  return (
    <div ref={containerRef} className="demo-container-wrapper">
      {shouldLoad ? <DemoContainer /> : <DemoContainerSkeleton />}
    </div>
  );
}