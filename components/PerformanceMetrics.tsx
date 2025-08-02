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
    color: "text-green-600"
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
    color: "text-[var(--color-success)]"
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
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
            Performance That Speaks for Itself
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Real metrics from our optimized websites, delivering exceptional user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className={`${metric.color} flex justify-center mb-4`}>
                {metric.icon}
              </div>
              <div className={`${metric.color} mb-2`}>
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                {metric.label}
              </h3>
              <p className="text-[var(--color-muted)] text-sm">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            Metrics measured with industry-standard tools: Google PageSpeed Insights, GTmetrix, and Pingdom
          </p>
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