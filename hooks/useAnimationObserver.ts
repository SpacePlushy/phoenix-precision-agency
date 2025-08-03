import { useEffect, useRef, useState, useCallback } from 'react';

interface AnimationObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Hook to observe element visibility and control animations
 * Optimized for Chrome with requestAnimationFrame
 */
export function useAnimationObserver(
  options: AnimationObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    freezeOnceVisible = true,
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const hasAnimated = useRef(false);
  const rafId = useRef<number | undefined>(undefined);

  // Callback to handle intersection changes
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const visible = entry.isIntersecting;
      
      if (visible && (!hasAnimated.current || !freezeOnceVisible)) {
        // Use requestAnimationFrame for smooth animation start
        rafId.current = requestAnimationFrame(() => {
          setIsVisible(true);
          setShouldAnimate(true);
          hasAnimated.current = true;
        });
      } else if (!visible && !freezeOnceVisible) {
        // Cancel any pending animation frame
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
        setIsVisible(false);
        setShouldAnimate(false);
      }
    });
  }, [freezeOnceVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create observer with Chrome-optimized settings
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      // Chrome optimization: use root:null for viewport
      root: null,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Ref callback to set element
  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return {
    ref,
    isVisible,
    shouldAnimate,
  };
}

/**
 * Hook for performance monitoring and Chrome DevTools integration
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Mark component render start
    performance.mark(`${componentName}-render-start`);

    return () => {
      // Mark component render end
      performance.mark(`${componentName}-render-end`);
      
      // Measure render time
      try {
        performance.measure(
          `${componentName}-render`,
          `${componentName}-render-start`,
          `${componentName}-render-end`
        );
      } catch (e) {
        // Ignore errors if marks don't exist
      }
    };
  }, [componentName]);
}