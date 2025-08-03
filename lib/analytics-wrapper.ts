// Analytics wrapper to ensure non-blocking operations
export function nonBlockingAnalytics<T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => void {
  return (...args: T) => {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        fn(...args).catch(() => {
          // Silently fail
        });
      }, { timeout: 2000 }); // Max 2 seconds wait
    } else {
      setTimeout(() => {
        fn(...args).catch(() => {
          // Silently fail
        });
      }, 0);
    }
  };
}

// Performance monitoring wrapper
export function withPerformanceMonitoring<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fnName: string,
  threshold = 100 // milliseconds
): (...args: T) => Promise<R> {
  return async (...args: T) => {
    const start = performance.now();
    
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      
      if (duration > threshold) {
        console.warn(`Analytics function ${fnName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Analytics function ${fnName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
}

// Rate limiting for analytics calls
const callCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitAnalytics<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  fnName: string,
  maxCalls = 100,
  windowMs = 60000 // 1 minute
): (...args: T) => Promise<R | void> {
  return async (...args: T) => {
    const now = Date.now();
    const callData = callCounts.get(fnName) || { count: 0, resetTime: now + windowMs };
    
    // Reset if window has passed
    if (now > callData.resetTime) {
      callData.count = 0;
      callData.resetTime = now + windowMs;
    }
    
    // Check rate limit
    if (callData.count >= maxCalls) {
      console.warn(`Rate limit exceeded for ${fnName}`);
      return;
    }
    
    callData.count++;
    callCounts.set(fnName, callData);
    
    return fn(...args);
  };
}