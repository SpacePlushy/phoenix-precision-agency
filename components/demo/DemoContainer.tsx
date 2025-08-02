"use client";

import React, { useState, useEffect } from 'react';
import OldSiteView from './OldSiteView';
import NewSiteView from './NewSiteView';

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
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
            See the Transformation
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Watch how we transform outdated websites into modern, high-performing digital experiences
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => handleViewClick('old')}
              className={`text-sm font-medium transition-colors ${
                activeView === 'old' 
                  ? 'text-[var(--color-accent)]' 
                  : 'text-[var(--color-muted)]'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => handleViewClick('new')}
              className={`text-sm font-medium transition-colors ${
                activeView === 'new' 
                  ? 'text-[var(--color-accent)]' 
                  : 'text-[var(--color-muted)]'
              }`}
            >
              After
            </button>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-[var(--color-accent)] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Demo Views Container */}
        <div className="relative">
          {/* Desktop: Side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            <div 
              className={`relative rounded-lg overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer ${
                activeView === 'old' 
                  ? 'ring-4 ring-[var(--color-accent)] scale-[1.02]' 
                  : 'opacity-50 hover:opacity-75'
              }`}
              onClick={() => handleViewClick('old')}
            >
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Before
                </span>
              </div>
              <OldSiteView className="w-full" />
            </div>
            
            <div 
              className={`relative rounded-lg overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer ${
                activeView === 'new' 
                  ? 'ring-4 ring-[var(--color-accent)] scale-[1.02]' 
                  : 'opacity-50 hover:opacity-75'
              }`}
              onClick={() => handleViewClick('new')}
            >
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-[var(--color-success)] text-white px-3 py-1 rounded-full text-sm font-medium">
                  After
                </span>
              </div>
              <NewSiteView className="w-full" />
            </div>
          </div>

          {/* Mobile: Single view with transition */}
          <div className="lg:hidden relative rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute top-4 left-4 z-10">
              <span className={`${
                activeView === 'old' 
                  ? 'bg-red-600' 
                  : 'bg-[var(--color-success)]'
              } text-white px-3 py-1 rounded-full text-sm font-medium transition-colors`}>
                {activeView === 'old' ? 'Before' : 'After'}
              </span>
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
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-[var(--color-muted)] mb-6">
            Ready to transform your digital presence?
          </p>
          <button className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Get Your Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}