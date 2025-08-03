/**
 * Performance Profiling Script for Demo Section Animations
 * 
 * This script profiles animation performance in Chrome vs Safari
 * and identifies bottlenecks in the demo section
 */

// Performance monitoring utilities
const PerformanceProfiler = {
  metrics: {
    fps: [],
    paintTime: [],
    layoutShifts: [],
    longTasks: [],
    animationFrames: []
  },

  // Monitor Frame Rate
  startFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    const fpsInterval = 1000; // Calculate FPS every second
    let fpsTimer = performance.now();

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - fpsTimer >= fpsInterval) {
        const fps = Math.round((frameCount * 1000) / (currentTime - fpsTimer));
        this.metrics.fps.push({
          time: currentTime,
          fps: fps,
          dropped: fps < 55 // Chrome typically targets 60fps
        });
        frameCount = 0;
        fpsTimer = currentTime;
      }

      lastTime = currentTime;
      this.rafId = requestAnimationFrame(measureFPS);
    };

    measureFPS();
  },

  // Monitor Layout Shifts
  observeLayoutShifts() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            this.metrics.layoutShifts.push({
              time: entry.startTime,
              value: entry.value,
              sources: entry.sources
            });
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Monitor Long Tasks (blocking main thread)
  observeLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.longTasks.push({
            time: entry.startTime,
            duration: entry.duration,
            name: entry.name
          });
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    }
  },

  // Monitor Paint Timing
  observePaintTiming() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.paintTime.push({
            name: entry.name,
            time: entry.startTime
          });
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  },

  // Analyze specific animation elements
  analyzeAnimations() {
    const animatedElements = {
      progressBar: document.querySelector('.bg-gradient-to-r.from-destructive.to-success'),
      marqueeElements: document.querySelectorAll('.animate-marquee'),
      pulseElements: document.querySelectorAll('.animate-pulse'),
      transitionElements: document.querySelectorAll('[class*="transition"]'),
      scaleElements: document.querySelectorAll('[class*="scale-"]'),
      blurElements: document.querySelectorAll('[class*="blur"]')
    };

    const analysis = {
      progressBar: this.analyzeProgressBar(animatedElements.progressBar),
      marquee: this.analyzeMarquee(animatedElements.marqueeElements),
      pulse: this.analyzePulse(animatedElements.pulseElements),
      transitions: this.analyzeTransitions(animatedElements.transitionElements),
      transforms: this.analyzeTransforms(animatedElements.scaleElements),
      filters: this.analyzeFilters(animatedElements.blurElements)
    };

    return analysis;
  },

  // Specific animation analyzers
  analyzeProgressBar(element) {
    if (!element) return null;
    
    const computedStyle = getComputedStyle(element);
    return {
      willChange: computedStyle.willChange,
      transform: computedStyle.transform,
      transition: computedStyle.transition,
      hasGPUAcceleration: computedStyle.transform !== 'none' || computedStyle.willChange === 'transform',
      gradientComplexity: this.analyzeGradient(computedStyle.backgroundImage)
    };
  },

  analyzeGradient(gradient) {
    // Chrome has issues with complex gradients during animations
    const colorStops = gradient.match(/rgb|#|hsl/g)?.length || 0;
    return {
      colorStops,
      isComplex: colorStops > 2,
      recommendation: colorStops > 2 ? 'Consider simplifying gradient or using CSS variables' : 'OK'
    };
  },

  analyzeMarquee(elements) {
    return Array.from(elements).map(el => {
      const computedStyle = getComputedStyle(el);
      const animation = computedStyle.animation;
      const transform = computedStyle.transform;
      
      return {
        element: el.className,
        animation,
        duration: animation.match(/(\d+(?:\.\d+)?s)/)?.[1],
        hasWillChange: computedStyle.willChange === 'transform',
        recommendation: !computedStyle.willChange.includes('transform') ? 
          'Add will-change: transform for better performance' : 'OK'
      };
    });
  },

  analyzePulse(elements) {
    return Array.from(elements).map(el => {
      const computedStyle = getComputedStyle(el);
      return {
        element: el.className,
        opacity: computedStyle.opacity,
        hasWillChange: computedStyle.willChange.includes('opacity'),
        isComposited: this.checkIfComposited(el)
      };
    });
  },

  analyzeTransitions(elements) {
    const heavyTransitions = [];
    Array.from(elements).forEach(el => {
      const computedStyle = getComputedStyle(el);
      const transition = computedStyle.transition;
      
      // Check for expensive properties
      if (transition.includes('all') || 
          transition.includes('box-shadow') || 
          transition.includes('filter')) {
        heavyTransitions.push({
          element: el.className,
          transition,
          recommendation: 'Avoid transitioning "all" or expensive properties like box-shadow'
        });
      }
    });
    return heavyTransitions;
  },

  analyzeTransforms(elements) {
    return Array.from(elements).map(el => {
      const computedStyle = getComputedStyle(el);
      const transform = computedStyle.transform;
      const hasTransform3d = transform.includes('3d') || 
                           computedStyle.transform.includes('translateZ') ||
                           computedStyle.willChange === 'transform';
      
      return {
        element: el.className,
        transform,
        has3dAcceleration: hasTransform3d,
        recommendation: !hasTransform3d ? 'Add translateZ(0) or will-change: transform' : 'OK'
      };
    });
  },

  analyzeFilters(elements) {
    // Blur filters are expensive in Chrome
    return Array.from(elements).map(el => {
      const computedStyle = getComputedStyle(el);
      const filter = computedStyle.filter;
      const opacity = computedStyle.opacity;
      
      return {
        element: el.className,
        filter,
        opacity,
        isExpensive: filter.includes('blur') && parseFloat(opacity) < 1,
        recommendation: filter.includes('blur') ? 
          'Consider using backdrop-filter or reducing blur radius' : 'OK'
      };
    });
  },

  checkIfComposited(element) {
    // Check if element is on its own compositing layer
    const transform = getComputedStyle(element).transform;
    const willChange = getComputedStyle(element).willChange;
    const position = getComputedStyle(element).position;
    const zIndex = getComputedStyle(element).zIndex;
    
    return transform !== 'none' || 
           willChange !== 'auto' || 
           (position === 'fixed' || position === 'absolute') && zIndex !== 'auto';
  },

  // Generate performance report
  generateReport() {
    const avgFPS = this.metrics.fps.reduce((sum, m) => sum + m.fps, 0) / this.metrics.fps.length;
    const droppedFrames = this.metrics.fps.filter(m => m.dropped).length;
    const layoutShiftScore = this.metrics.layoutShifts.reduce((sum, m) => sum + m.value, 0);
    const longTasksCount = this.metrics.longTasks.length;
    const animationAnalysis = this.analyzeAnimations();

    return {
      summary: {
        browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                navigator.userAgent.includes('Safari') ? 'Safari' : 'Other',
        averageFPS: avgFPS.toFixed(2),
        droppedFrames,
        droppedFramePercentage: ((droppedFrames / this.metrics.fps.length) * 100).toFixed(2) + '%',
        layoutShiftScore: layoutShiftScore.toFixed(4),
        longTasksCount,
        totalLongTaskTime: this.metrics.longTasks.reduce((sum, t) => sum + t.duration, 0).toFixed(2) + 'ms'
      },
      animations: animationAnalysis,
      recommendations: this.generateRecommendations(animationAnalysis, avgFPS, layoutShiftScore)
    };
  },

  generateRecommendations(analysis, avgFPS, cls) {
    const recommendations = [];

    // FPS-based recommendations
    if (avgFPS < 50) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Low frame rate detected',
        solution: 'Reduce animation complexity and enable GPU acceleration'
      });
    }

    // Progress bar specific
    if (analysis.progressBar && !analysis.progressBar.hasGPUAcceleration) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Progress bar not GPU accelerated',
        solution: 'Add transform: translateZ(0) or will-change: transform to progress bar'
      });
    }

    // Gradient complexity
    if (analysis.progressBar?.gradientComplexity?.isComplex) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Complex gradient animation',
        solution: 'Use solid colors or simpler gradients for animated elements'
      });
    }

    // Blur filter performance
    const expensiveBlurs = analysis.filters?.filter(f => f.isExpensive) || [];
    if (expensiveBlurs.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Expensive blur filters detected',
        solution: 'Replace blur filters with backdrop-filter or reduce blur radius'
      });
    }

    // Transition all
    if (analysis.transitions?.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Inefficient transition properties',
        solution: 'Specify exact properties instead of "all" in transitions'
      });
    }

    // Layout shifts
    if (cls > 0.1) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'High cumulative layout shift',
        solution: 'Reserve space for animated elements and avoid layout-triggering properties'
      });
    }

    return recommendations;
  },

  // Start profiling
  startProfiling(duration = 10000) {
    console.log('Starting performance profiling...');
    this.startFPSMonitoring();
    this.observeLayoutShifts();
    this.observeLongTasks();
    this.observePaintTiming();

    setTimeout(() => {
      cancelAnimationFrame(this.rafId);
      const report = this.generateReport();
      console.log('Performance Report:', report);
      
      // Save report for analysis
      window.performanceReport = report;
      
      // Display in console with formatting
      console.group('🎯 Performance Analysis Complete');
      console.table(report.summary);
      console.group('📊 Animation Analysis');
      console.log('Progress Bar:', report.animations.progressBar);
      console.log('Marquee:', report.animations.marquee);
      console.log('Transitions:', report.animations.transitions);
      console.log('Filters:', report.animations.filters);
      console.groupEnd();
      console.group('💡 Recommendations');
      report.recommendations.forEach(rec => {
        console.log(`[${rec.priority}] ${rec.issue}\n   → ${rec.solution}`);
      });
      console.groupEnd();
      console.groupEnd();
    }, duration);
  }
};

// Auto-start profiling when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => PerformanceProfiler.startProfiling(), 2000);
  });
} else {
  setTimeout(() => PerformanceProfiler.startProfiling(), 2000);
}

// Export for manual usage
window.PerformanceProfiler = PerformanceProfiler;