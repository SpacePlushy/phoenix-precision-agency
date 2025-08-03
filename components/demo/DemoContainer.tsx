"use client";

import React, { useState, useEffect, useCallback } from 'react';
import OldSiteView from './OldSiteView';
import NewSiteView from './NewSiteView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAnimationObserver, usePerformanceMonitor } from '@/hooks/useAnimationObserver';

export default function DemoContainer() {
  const [activeView, setActiveView] = useState<'old' | 'new'>('old');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Performance monitoring for Chrome DevTools
  usePerformanceMonitor('DemoContainer');
  
  // Animation observer for optimal performance
  const { ref: sectionRef, shouldAnimate } = useAnimationObserver({
    threshold: 0.3,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (isPaused || !shouldAnimate) return;

    let rafId: number;
    let lastTime = performance.now();
    const duration = 3000; // 3 seconds
    let elapsed = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      elapsed += deltaTime;

      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setActiveView((current) => current === 'old' ? 'new' : 'old');
        elapsed = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isPaused, shouldAnimate]);

  const handleViewClick = useCallback((view: 'old' | 'new') => {
    // Use requestAnimationFrame for smooth state updates
    requestAnimationFrame(() => {
      setActiveView(view);
      setProgress(0);
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 1000); // Resume after 1 second
    });
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden demo-section"
      style={{ contain: 'layout style paint' }} // CSS containment for performance
    >
      {/* Subtle background pattern - optimized for Chrome */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent rounded-full blur-2xl gpu-accelerated"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary rounded-full blur-2xl gpu-accelerated"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with improved spacing */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-6 py-2 text-sm font-medium bg-accent/10 text-accent border-accent/20">
            ⚡ Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            See the <span className="text-gradient">Transformation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience firsthand how we transform outdated websites into modern, high-performing digital experiences that drive results
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant={activeView === 'old' ? 'default' : 'outline'}
              onClick={() => handleViewClick('old')}
              size="lg"
              className={`transition-transform transition-opacity duration-300 gpu-accelerated ${activeView === 'old' ? 'shadow-lg scale-optimized-active' : 'scale-optimized scale-optimized-hover'}`}
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${activeView === 'old' ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`}></div>
              <span className="font-semibold">2005 Website</span>
            </Button>
            <div className="relative flex-1 mx-6 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
              <div 
                className="progress-bar-fill absolute left-0 top-0 h-full bg-gradient-to-r from-destructive to-success shadow-sm"
                style={{ '--progress': progress / 100 } as React.CSSProperties}
              />
            </div>
            <Button
              variant={activeView === 'new' ? 'default' : 'outline'}
              onClick={() => handleViewClick('new')}
              size="lg"
              className={`transition-transform transition-opacity duration-300 gpu-accelerated ${activeView === 'new' ? 'shadow-lg scale-optimized-active' : 'scale-optimized scale-optimized-hover'}`}
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${activeView === 'new' ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`}></div>
              <span className="font-semibold">Modern Website</span>
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Click to compare or watch the automatic demonstration
          </p>
        </div>

        {/* Demo Views Container */}
        <div className="relative">
          {/* Desktop: Side by side with enhanced styling */}
          <div className="hidden lg:grid grid-cols-2 gap-12">
            {/* Before Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 to-orange-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-1000 group-hover:duration-200 gpu-accelerated"></div>
              <Card 
                className={`relative overflow-hidden transition-transform transition-shadow duration-500 cursor-pointer rounded-xl chrome-optimized ${
                  activeView === 'old' 
                    ? 'shadow-2xl border-destructive/30 ring-2 ring-destructive/20 scale-optimized-active' 
                    : 'shadow-xl border-border hover:shadow-2xl hover:border-destructive/20 scale-optimized scale-optimized-hover'
                }`}
                onClick={() => handleViewClick('old')}
              >
                <div className="absolute top-6 left-6 z-20">
                  <Badge variant="destructive" className="font-bold text-sm px-4 py-2 shadow-lg">
                    ❌ BEFORE (2005)
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <OldSiteView className="w-full" />
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-destructive/5 to-transparent pointer-events-none"></div>
              </Card>
            </div>
            
            {/* After Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-success/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition-opacity duration-1000 group-hover:duration-200 gpu-accelerated"></div>
              <Card 
                className={`relative overflow-hidden transition-transform transition-shadow duration-500 cursor-pointer rounded-xl chrome-optimized ${
                  activeView === 'new' 
                    ? 'shadow-2xl border-success/30 ring-2 ring-success/20 scale-optimized-active' 
                    : 'shadow-xl border-border hover:shadow-2xl hover:border-success/20 scale-optimized scale-optimized-hover'
                }`}
                onClick={() => handleViewClick('new')}
              >
                <div className="absolute top-6 left-6 z-20">
                  <Badge className="bg-success hover:bg-success text-white font-bold text-sm px-4 py-2 shadow-lg">
                    ✅ AFTER (2024)
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <NewSiteView className="w-full" />
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-success/5 to-transparent pointer-events-none"></div>
              </Card>
            </div>
          </div>

          {/* Mobile: Enhanced single view with improved transitions */}
          <div className="lg:hidden relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-25"></div>
            <Card className="relative overflow-hidden shadow-2xl rounded-xl">
              <div className="absolute top-6 left-6 z-20">
                <Badge 
                  variant={activeView === 'old' ? 'destructive' : 'default'} 
                  className={`font-bold text-sm px-4 py-2 shadow-lg ${
                    activeView === 'new' ? 'bg-success hover:bg-success text-white' : ''
                  }`}
                >
                  {activeView === 'old' ? '❌ BEFORE (2005)' : '✅ AFTER (2024)'}
                </Badge>
              </div>
              
              <div className="relative h-[500px] overflow-hidden">
                <div 
                  className={`absolute inset-0 mobile-view-transition transition-transform transition-opacity duration-700 ease-in-out ${
                    activeView === 'old' ? 'opacity-100' : 'opacity-0 transform translate-x-full'
                  }`}
                  style={{ contain: 'layout style paint' }}
                >
                  <OldSiteView className="w-full" />
                </div>
                <div 
                  className={`absolute inset-0 mobile-view-transition transition-transform transition-opacity duration-700 ease-in-out ${
                    activeView === 'new' ? 'opacity-100' : 'opacity-0 transform -translate-x-full'
                  }`}
                  style={{ contain: 'layout style paint' }}
                >
                  <NewSiteView className="w-full" />
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                activeView === 'old' ? 'from-destructive/5 to-transparent' : 'from-success/5 to-transparent'
              }`}></div>
            </Card>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 rounded-2xl p-12 border border-border/50 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to Leave 2005 Behind?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your outdated website into a modern, high-converting digital experience
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-colors transition-shadow transition-transform gpu-accelerated scale-optimized scale-optimized-hover">
                <Link href="/contact">
                  Get Your Free Transformation Plan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-colors transition-border transition-transform gpu-accelerated scale-optimized scale-optimized-hover">
                <Link href="/portfolio">
                  See More Transformations
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>NASA-grade precision</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}