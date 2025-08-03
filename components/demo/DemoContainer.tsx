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
    <section className="py-20 aerospace-gradient-subtle relative overflow-hidden">
      {/* Background elements for depth */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Before & After Showcase
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            See the Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Watch how we transform outdated websites into modern, high-performing digital experiences
            that drive real business results
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <Card className="mb-12 max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant={activeView === 'old' ? 'default' : 'ghost'}
                onClick={() => handleViewClick('old')}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${activeView === 'old' ? 'bg-red-500' : 'bg-muted-foreground/30'}`}></div>
                Before
              </Button>
              <Button
                variant={activeView === 'new' ? 'default' : 'ghost'}
                onClick={() => handleViewClick('new')}
                className="flex items-center gap-2"
              >
                <div className={`w-3 h-3 rounded-full ${activeView === 'new' ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}></div>
                After
              </Button>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demo Views Container */}
        <div className="relative">
          {/* Desktop: Side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            <Card 
              className={`relative overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer ${
                activeView === 'old' 
                  ? 'border-accent shadow-accent/20 scale-[1.02]' 
                  : 'border-border opacity-70 hover:opacity-85 hover:border-accent/30'
              }`}
              onClick={() => handleViewClick('old')}
            >
              <div className="absolute top-6 left-6 z-10">
                <Badge variant="destructive">
                  Before
                </Badge>
              </div>
              <OldSiteView className="w-full" />
            </Card>
            
            <Card 
              className={`relative overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer ${
                activeView === 'new' 
                  ? 'border-accent shadow-accent/20 scale-[1.02]' 
                  : 'border-border opacity-70 hover:opacity-85 hover:border-accent/30'
              }`}
              onClick={() => handleViewClick('new')}
            >
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-emerald-600 hover:bg-emerald-600">
                  After
                </Badge>
              </div>
              <NewSiteView className="w-full" />
            </Card>
          </div>

          {/* Mobile: Single view with transition */}
          <Card className="lg:hidden relative overflow-hidden shadow-2xl">
            <div className="absolute top-4 left-4 z-10">
              <Badge variant={activeView === 'old' ? 'destructive' : 'default'} className={activeView === 'new' ? 'bg-emerald-600 hover:bg-emerald-600' : ''}>
                {activeView === 'old' ? 'Before' : 'After'}
              </Badge>
            </div>
            
            <div className="relative h-[600px] overflow-hidden">
              <div 
                className={`absolute inset-0 transition-transform duration-500 ${
                  activeView === 'old' ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <OldSiteView className="w-full h-full" />
              </div>
              <div 
                className={`absolute inset-0 transition-transform duration-500 ${
                  activeView === 'new' ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                <NewSiteView className="w-full h-full" />
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Call to Action */}
        <Card className="mt-16 max-w-2xl mx-auto">
          <CardContent className="text-center p-8">
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Ready to transform your digital presence with aerospace precision?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
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
            
            {/* Gold accent line */}
            <div className="mt-8 flex items-center justify-center">
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}