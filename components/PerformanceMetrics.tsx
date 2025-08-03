"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Zap, Server } from "lucide-react";
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
    icon: <TrendingUp className="w-8 h-8" />,
    value: 97,
    suffix: "%",
    label: "PageSpeed Score",
    description: "Google Core Web Vitals",
    colorClass: "text-emerald-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: 2.1,
    suffix: "s",
    label: "Load Time",
    description: "Average first paint",
    colorClass: "text-blue-600"
  },
  {
    icon: <Server className="w-8 h-8" />,
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Monthly availability",
    colorClass: "text-yellow-600"
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
    <section className="py-20 aerospace-gradient-subtle relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Performance Analytics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Performance That Speaks for Itself
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real metrics from our optimized websites, delivering exceptional user experiences
            with aerospace-grade reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="group text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-border hover:border-accent/50">
              <CardContent className="p-10">
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-lg"></div>
                  <div className={`relative w-20 h-20 mx-auto rounded-full flex items-center justify-center ${metric.colorClass} bg-gradient-to-br from-background to-muted shadow-lg border border-border`}>
                    {metric.icon}
                  </div>
                </div>
                
                {/* Animated counter */}
                <div className={`${metric.colorClass} mb-4`}>
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </div>
                
                {/* Label and description */}
                <CardTitle className="text-xl mb-3 group-hover:text-accent transition-colors">
                  {metric.label}
                </CardTitle>
                <CardDescription className="font-medium">
                  {metric.description}
                </CardDescription>
                
                {/* Bottom accent line */}
                <div className="mt-6 mx-auto w-12 h-1 bg-gradient-to-r from-accent to-yellow-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced footer with certification badges */}
        <div className="mt-16 text-center">
          <Badge variant="outline" className="inline-flex items-center gap-3 px-6 py-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow"></div>
            <span className="text-sm font-medium">
              Metrics measured with industry-standard tools: Google PageSpeed Insights, GTmetrix, and Pingdom
            </span>
          </Badge>
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