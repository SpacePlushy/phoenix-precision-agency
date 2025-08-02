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
    <section className="py-20 bg-gradient-to-br from-[var(--color-gray-50)] via-white to-[var(--color-gray-50)] relative overflow-hidden">
      {/* Background elements for depth */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Before & After Showcase
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
            See the Transformation
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-3xl mx-auto leading-relaxed">
            Watch how we transform outdated websites into modern, high-performing digital experiences
            that drive real business results
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleViewClick('old')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeView === 'old' 
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-sm' 
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-gray-100)]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${activeView === 'old' ? 'bg-red-500' : 'bg-[var(--color-gray-300)]'}`}></div>
              Before
            </button>
            <button
              onClick={() => handleViewClick('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeView === 'new' 
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-sm' 
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-gray-100)]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${activeView === 'new' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-gray-300)]'}`}></div>
              After
            </button>
          </div>
          <div className="relative h-3 bg-[var(--color-gray-200)] rounded-full overflow-hidden shadow-inner">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] transition-all duration-100 ease-linear rounded-full shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Demo Views Container */}
        <div className="relative">
          {/* Desktop: Side by side */}
          <div className="hidden lg:grid grid-cols-2 gap-8">
            <div 
              className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer border-2 ${
                activeView === 'old' 
                  ? 'border-[var(--color-accent)] shadow-[var(--color-accent)]/20 scale-[1.02]' 
                  : 'border-[var(--color-border)] opacity-70 hover:opacity-85 hover:border-[var(--color-accent)]/30'
              }`}
              onClick={() => handleViewClick('old')}
            >
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Before
                </span>
              </div>
              <OldSiteView className="w-full" />
            </div>
            
            <div 
              className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-500 cursor-pointer border-2 ${
                activeView === 'new' 
                  ? 'border-[var(--color-accent)] shadow-[var(--color-accent)]/20 scale-[1.02]' 
                  : 'border-[var(--color-border)] opacity-70 hover:opacity-85 hover:border-[var(--color-accent)]/30'
              }`}
              onClick={() => handleViewClick('new')}
            >
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-gradient-to-r from-[var(--color-success)] to-[var(--color-success)] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
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

        {/* Enhanced Call to Action */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-[var(--color-muted)] mb-8 leading-relaxed">
              Ready to transform your digital presence with aerospace precision?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 border border-[var(--color-accent)]">
                Get Your Free Consultation
              </button>
              <button className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-4 rounded-lg font-semibold hover:bg-[var(--color-primary)] hover:text-white transition-all transform hover:scale-105">
                View More Examples
              </button>
            </div>
          </div>
          
          {/* Gold accent line */}
          <div className="mt-8 flex items-center justify-center">
            <div className="w-16 h-1 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}