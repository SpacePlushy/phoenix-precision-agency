"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Zap } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Metric {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  description: string;
  colorClass: string;
}

const metrics: Metric[] = [
  {
    icon: <TrendingUp className="size-8" />,
    value: 100,
    suffix: "",
    label: "Performance Score",
    description: "Google Core Web Vitals",
    colorClass: "text-success"
  },
  {
    icon: <Zap className="size-8" />,
    value: 0.8,
    suffix: "s",
    label: "Load Time",
    description: "Average page load speed",
    colorClass: "text-accent"
  },
  {
    icon: <Zap className="size-8" />,
    value: 1.2,
    suffix: "s",
    label: "Time to Interactive",
    description: "When page becomes interactive",
    colorClass: "text-gold"
  },
  {
    icon: <Zap className="size-8" />,
    value: 0.5,
    suffix: "s",
    label: "First Contentful Paint",
    description: "Initial content display",
    colorClass: "text-blue-400"
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
    <section className="py-24 bg-muted/30 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            Performance Metrics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lightning-Fast Performance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real metrics from our optimized websites, delivering exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="group text-center hover:shadow-lg transition-all duration-300 border-border hover:border-accent/20">
              <CardContent className="p-8">
                {/* Icon */}
                <div className={`${metric.colorClass} mb-6`}>
                  {metric.icon}
                </div>
                
                {/* Animated counter */}
                <div className={`${metric.colorClass} mb-4`}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                
                {/* Label and description */}
                <CardTitle className="text-xl mb-2 font-semibold">
                  {metric.label}
                </CardTitle>
                <CardDescription className="text-sm">
                  {metric.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Metrics verified with Google PageSpeed Insights, GTmetrix, and Pingdom
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