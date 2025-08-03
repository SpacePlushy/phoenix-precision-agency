"use client";

import React from 'react';

interface NewSiteViewProps {
  className?: string;
}

export default function NewSiteView({ className = '' }: NewSiteViewProps) {
  return (
    <div className={`${className} bg-background min-h-[600px] overflow-hidden relative`}>
      {/* Browser Chrome */}
      <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-300">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4 bg-white rounded px-3 py-1 text-xs text-gray-700 font-mono border border-gray-200">
          https://phoenixprecision.com
        </div>
        <div className="text-xs text-gray-500">🔒</div>
      </div>
      
      {/* Modern Navigation Bar */}
      <nav className="bg-card shadow-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary">
                  Phoenix Precision
                </h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#" className="text-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors gpu-accelerated">
                    Services
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors gpu-accelerated">
                    Portfolio
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors gpu-accelerated">
                    About
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors gpu-accelerated">
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button className="border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted hover:text-accent transition-colors transition-background gpu-accelerated">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.25 0.03 260) 0%, oklch(0.25 0.03 260) 70%, oklch(0.55 0.12 250) 100%)' }}>
        {/* Background decoration - optimized */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-xl gpu-accelerated"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white rounded-full blur-lg gpu-accelerated"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white/90 border border-white/20">
                  ⚡ Lightning Fast Loading
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Digital Presence</span>
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Modern web solutions that drive growth and engage your audience. 
                Fast, secure, and built for lasting success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:shadow-2xl transition-shadow transition-transform gpu-accelerated scale-optimized scale-optimized-hover flex items-center justify-center gap-2">
                  <span>View Our Work</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors transition-background transition-transform gpu-accelerated scale-optimized scale-optimized-hover flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Schedule a Call</span>
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Mobile Optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>SEO Ready</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl blur-3xl opacity-30" style={{ background: 'linear-gradient(45deg, #60a5fa, #9333ea, #f59e0b)' }}></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                  <div className="space-y-6">
                    {/* Mock dashboard header */}
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-white/40 rounded w-1/3"></div>
                      <div className="h-3 bg-white/20 rounded w-1/4"></div>
                    </div>
                    {/* Mock analytics chart */}
                    <div className="h-24 bg-white/10 rounded-lg relative overflow-hidden">
                      <div className="absolute bottom-0 left-0 w-full h-full flex items-end gap-2 p-4">
                        <div className="bg-gradient-to-t from-blue-400 to-transparent w-4 h-16 rounded-t"></div>
                        <div className="bg-gradient-to-t from-green-400 to-transparent w-4 h-20 rounded-t"></div>
                        <div className="bg-gradient-to-t from-purple-400 to-transparent w-4 h-12 rounded-t"></div>
                        <div className="bg-gradient-to-t from-blue-400 to-transparent w-4 h-18 rounded-t"></div>
                        <div className="bg-gradient-to-t from-green-400 to-transparent w-4 h-22 rounded-t"></div>
                      </div>
                    </div>
                    {/* Mock content lines */}
                    <div className="space-y-3">
                      <div className="h-3 bg-white/30 rounded w-full"></div>
                      <div className="h-3 bg-white/20 rounded w-4/5"></div>
                      <div className="h-3 bg-white/20 rounded w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <p className="text-muted-foreground">Projects Delivered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">3x</div>
              <p className="text-muted-foreground">Average ROI Increase</p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow gpu-accelerated">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Optimized for speed with sub-3s load times</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow gpu-accelerated">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground text-sm">Responsive design that works on all devices</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow gpu-accelerated">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground text-sm">Built with security best practices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}