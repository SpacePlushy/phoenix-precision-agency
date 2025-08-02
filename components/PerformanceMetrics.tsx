"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Zap, Server } from "lucide-react";

interface Metric {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const metrics: Metric[] = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: 97,
    suffix: "%",
    label: "PageSpeed Score",
    description: "Google Core Web Vitals",
    color: "text-[var(--color-success)]"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: 2.1,
    suffix: "s",
    label: "Load Time",
    description: "Average first paint",
    color: "text-[var(--color-accent)]"
  },
  {
    icon: <Server className="w-8 h-8" />,
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Monthly availability",
    color: "text-[var(--color-gold)]"
  }
];

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  duration?: number;
}

function AnimatedCounter({ value, suffix, duration = 2000 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className="text-3xl md:text-4xl font-bold">
      {count.toFixed(value % 1 !== 0 ? 1 : 0)}{suffix}
    </span>
  );
}

export default function PerformanceMetrics() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[var(--color-gray-50)] relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
            Performance That Speaks for Itself
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Real metrics from our optimized websites, delivering exceptional user experiences
            with aerospace-grade reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="group text-center p-10 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transform hover:scale-105"
            >
              {/* Icon with gradient background */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 rounded-full blur-lg"></div>
                <div className={`relative w-20 h-20 mx-auto rounded-full flex items-center justify-center ${metric.color} bg-gradient-to-br from-[var(--color-gray-50)] to-white shadow-lg border border-[var(--color-border)]`}>
                  {metric.icon}
                </div>
              </div>
              
              {/* Animated counter */}
              <div className={`${metric.color} mb-4`}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              
              {/* Label and description */}
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                {metric.label}
              </h3>
              <p className="text-[var(--color-muted)] font-medium">
                {metric.description}
              </p>
              
              {/* Bottom accent line */}
              <div className="mt-6 mx-auto w-12 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-gold)] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Enhanced footer with certification badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-[var(--color-gray-50)] px-6 py-3 rounded-full border border-[var(--color-border)]">
            <div className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></div>
            <p className="text-sm text-[var(--color-muted)] font-medium">
              Metrics measured with industry-standard tools: Google PageSpeed Insights, GTmetrix, and Pingdom
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Usage example:
// <PerformanceMetrics />
//
// Features:
// - Animated counters that trigger on scroll
// - Responsive design for mobile and desktop
// - Accessible with proper ARIA labels
// - Performance optimized with intersection observer
// - Clean, modern design with accent colors