"use client";

import React, { useState, useEffect } from 'react';
import OldSiteView from './OldSiteView';
import NewSiteView from './NewSiteView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DemoContainer() {
  const [activeView, setActiveView] = useState<'old' | 'new'>('old');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveView((current) => current === 'old' ? 'new' : 'old');
          return 0;
        }
        return prev + (100 / 30); // 30 steps for 3 seconds
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleViewClick = (view: 'old' | 'new') => {
    setActiveView(view);
    setProgress(0);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 1000); // Resume after 1 second
  };

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with improved spacing */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            Live Demo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            See the Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how we transform outdated websites into modern, high-performing digital experiences
          </p>
        </div>

        {/* Simplified Progress Bar */}
        <div className="mb-12 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant={activeView === 'old' ? 'default' : 'outline'}
              onClick={() => handleViewClick('old')}
              size="sm"
              className="transition-all"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${activeView === 'old' ? 'bg-destructive' : 'bg-muted-foreground'}`}></div>
              Before
            </Button>
            <div className="relative flex-1 mx-4 h-1 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Button
              variant={activeView === 'new' ? 'default' : 'outline'}
              onClick={() => handleViewClick('new')}
              size="sm"
              className="transition-all"
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${activeView === 'new' ? 'bg-success' : 'bg-muted-foreground'}`}></div>
              After
            </Button>
          </div>
        </div>

        {/* Demo Views Container */}
        <div className="relative">
          {/* Desktop: Side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            <Card 
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeView === 'old' 
                  ? 'shadow-2xl border-destructive/20 ring-2 ring-destructive/10' 
                  : 'shadow-lg border-border hover:shadow-xl hover:border-muted-foreground/30'
              }`}
              onClick={() => handleViewClick('old')}
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="destructive" className="font-semibold">
                  Before
                </Badge>
              </div>
              <CardContent className="p-0">
                <OldSiteView className="w-full" />
              </CardContent>
            </Card>
            
            <Card 
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeView === 'new' 
                  ? 'shadow-2xl border-success/20 ring-2 ring-success/10' 
                  : 'shadow-lg border-border hover:shadow-xl hover:border-muted-foreground/30'
              }`}
              onClick={() => handleViewClick('new')}
            >
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-success hover:bg-success text-white font-semibold">
                  After
                </Badge>
              </div>
              <CardContent className="p-0">
                <NewSiteView className="w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Mobile: Single view with fade transition */}
          <Card className="lg:hidden relative overflow-hidden shadow-xl">
            <div className="absolute top-4 left-4 z-10">
              <Badge 
                variant={activeView === 'old' ? 'destructive' : 'default'} 
                className={`font-semibold ${activeView === 'new' ? 'bg-success hover:bg-success text-white' : ''}`}
              >
                {activeView === 'old' ? 'Before' : 'After'}
              </Badge>
            </div>
            
            <div className="relative h-[500px] overflow-hidden">
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeView === 'old' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <OldSiteView className="w-full" />
              </div>
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeView === 'new' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <NewSiteView className="w-full" />
              </div>
            </div>
          </Card>
        </div>

        {/* Simplified Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-8">
            Ready to transform your digital presence?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Get Your Free Consultation
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">
                View More Examples
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}