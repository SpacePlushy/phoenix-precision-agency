"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, AnimationPlaybackControls, useTransform, AnimatePresence, Variants } from 'framer-motion';
import OldSiteView from './OldSiteView';
import NewSiteView from './NewSiteView';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { generateSessionId, trackDemoStart, trackDemoEnd, trackDemoInteraction, trackViewportTime } from '@/lib/analytics';

export default function DemoContainer() {
  const [activeView, setActiveView] = useState<'old' | 'new'>('old');
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const progressScale = useTransform(progress, [0, 100], [0, 1]);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const [sessionId] = useState(() => generateSessionId());
  const viewStartTime = useRef<number>(Date.now());
  const interactionCount = useRef<number>(0);
  const isComponentMounted = useRef<boolean>(true);

  // Zoom animation variants with proper TypeScript typing
  const zoomVariants: Variants = {
    initial: {
      scale: 0.95,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // easeOut cubic-bezier
      }
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: [0.55, 0.06, 0.68, 0.19], // easeIn cubic-bezier
      }
    }
  };

  // Track initial demo view
  useEffect(() => {
    // Wrap in try-catch to prevent breaking the component
    try {
      trackDemoStart(sessionId, activeView).catch(() => {
        // Silently fail - analytics should not break the UI
      });
    } catch (_error) {
      // Extra safety - ensure analytics never break the demo
    }
    
    // Track viewport time when component unmounts
    const startTime = viewStartTime.current; // Capture ref value in effect scope
    return () => {
      isComponentMounted.current = false;
      const viewportTime = Date.now() - startTime;
      // Ensure analytics don't break on unmount
      Promise.all([
        trackViewportTime(sessionId, viewportTime),
        trackDemoEnd(sessionId)
      ]).catch(() => {
        // Silently fail - analytics should not break the UI
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Only run once on mount

  useEffect(() => {
    // Clean up any existing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }

    if (isPaused) return;

    let isViewSwitched = false;

    // Monitor progress value and switch views when it reaches 100
    const unsubscribe = progress.on("change", (latest) => {
      // Check if component is still mounted
      if (!isComponentMounted.current) return;
      
      if (latest >= 99 && !isViewSwitched && !isPaused) {
        isViewSwitched = true;
        setActiveView((current) => current === 'old' ? 'new' : 'old');
      }
      // Reset flag when animation restarts
      if (latest < 10) {
        isViewSwitched = false;
      }
    });

    // Create the animation
    const runAnimation = () => {
      // Reset progress to 0
      progress.set(0);
      
      // Animate from 0 to 100
      animationRef.current = animate(progress, 100, {
        duration: 3,
        ease: [0, 0, 1, 1], // linear cubic-bezier
        repeat: Infinity,
        repeatType: "loop"
      });
    };

    runAnimation();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused]);

  const handleViewClick = (view: 'old' | 'new') => {
    setActiveView(view);
    progress.set(0);
    setIsPaused(true);
    
    // Track interaction
    interactionCount.current++;
    // Track interaction without breaking UI
    trackDemoInteraction(sessionId).catch(() => {
      // Silently fail - analytics should not break the UI
    });
    
    // Stop any ongoing animation
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    // Resume after a short delay
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
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
              className={`transition-all duration-300 ${activeView === 'old' ? 'shadow-lg scale-105' : 'hover:scale-105'}`}
              aria-pressed={activeView === 'old'}
              aria-label="2005 Website"
            >
              <div className={`w-3 h-3 rounded-full mr-3 ${activeView === 'old' ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'}`}></div>
              <span className="font-semibold">2005 Website</span>
            </Button>
            <div className="relative flex-1 mx-6 h-2 bg-muted rounded-full overflow-hidden shadow-inner">
              <div className="absolute inset-0 w-full h-full">
                <motion.div 
                  className="h-full bg-gradient-to-r from-destructive via-orange-500 to-success shadow-sm rounded-full origin-left"
                  style={{ 
                    scaleX: progressScale,
                    willChange: 'transform'
                  }}
                >
                  {/* Add a subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-orange-500/20 to-success/20 blur-sm" />
                </motion.div>
              </div>
            </div>
            <Button
              variant={activeView === 'new' ? 'default' : 'outline'}
              onClick={() => handleViewClick('new')}
              size="lg"
              className={`transition-all duration-300 ${activeView === 'new' ? 'shadow-lg scale-105' : 'hover:scale-105'}`}
              aria-pressed={activeView === 'new'}
              aria-label="Modern Website"
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
            <motion.div 
              className="relative group"
              initial={false}
              animate={{
                scale: activeView === 'old' ? 1.05 : 1,
                transition: {
                  duration: 0.5,
                  ease: [0.42, 0, 0.58, 1] // easeInOut cubic-bezier
                }
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 to-orange-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Card 
                className={`relative overflow-hidden transition-all duration-500 cursor-pointer rounded-xl ${
                  activeView === 'old' 
                    ? 'shadow-2xl border-destructive/30 ring-2 ring-destructive/20' 
                    : 'shadow-xl border-border hover:shadow-2xl hover:border-destructive/20'
                }`}
                onClick={() => handleViewClick('old')}
              >
                <div className="absolute top-6 left-6 z-20">
                  <Badge variant="destructive" className="font-bold text-sm px-4 py-2 shadow-lg">
                    ❌ BEFORE (2005)
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: activeView === 'old' ? 1 : 0.7,
                      filter: activeView === 'old' ? 'blur(0px)' : 'blur(2px)',
                      transition: {
                        duration: 0.5,
                        ease: [0.42, 0, 0.58, 1] // easeInOut cubic-bezier
                      }
                    }}
                  >
                    <OldSiteView className="w-full" />
                  </motion.div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-destructive/5 to-transparent pointer-events-none"></div>
              </Card>
            </motion.div>
            
            {/* After Card */}
            <motion.div 
              className="relative group"
              initial={false}
              animate={{
                scale: activeView === 'new' ? 1.05 : 1,
                transition: {
                  duration: 0.5,
                  ease: [0.42, 0, 0.58, 1] // easeInOut cubic-bezier
                }
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-success/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Card 
                className={`relative overflow-hidden transition-all duration-500 cursor-pointer rounded-xl ${
                  activeView === 'new' 
                    ? 'shadow-2xl border-success/30 ring-2 ring-success/20' 
                    : 'shadow-xl border-border hover:shadow-2xl hover:border-success/20'
                }`}
                onClick={() => handleViewClick('new')}
              >
                <div className="absolute top-6 left-6 z-20">
                  <Badge className="bg-success hover:bg-success text-white font-bold text-sm px-4 py-2 shadow-lg">
                    ✅ AFTER (2024)
                  </Badge>
                </div>
                <CardContent className="p-0">
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: activeView === 'new' ? 1 : 0.7,
                      filter: activeView === 'new' ? 'blur(0px)' : 'blur(2px)',
                      transition: {
                        duration: 0.5,
                        ease: [0.42, 0, 0.58, 1] // easeInOut cubic-bezier
                      }
                    }}
                  >
                    <NewSiteView className="w-full" />
                  </motion.div>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-t from-success/5 to-transparent pointer-events-none"></div>
              </Card>
            </motion.div>
          </div>

          {/* Mobile: Enhanced single view with improved transitions */}
          <div className="lg:hidden relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-2xl blur opacity-25"></div>
            <Card className="relative overflow-hidden shadow-2xl rounded-xl">
              <div className="absolute top-6 left-6 z-20">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge 
                    variant={activeView === 'old' ? 'destructive' : 'default'} 
                    className={`font-bold text-sm px-4 py-2 shadow-lg ${
                      activeView === 'new' ? 'bg-success hover:bg-success text-white' : ''
                    }`}
                  >
                    {activeView === 'old' ? '❌ BEFORE (2005)' : '✅ AFTER (2024)'}
                  </Badge>
                </motion.div>
              </div>
              
              <div className="relative h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeView === 'old' ? (
                    <motion.div
                      key="old"
                      className="absolute inset-0"
                      variants={zoomVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <OldSiteView className="w-full" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="new"
                      className="absolute inset-0"
                      variants={zoomVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <NewSiteView className="w-full" />
                    </motion.div>
                  )}
                </AnimatePresence>
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
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Link href="/contact">
                  Get Your Free Transformation Plan
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-all hover:scale-105 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Link href="/portfolio">
                  See More Transformations
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Expert guidance</span>
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