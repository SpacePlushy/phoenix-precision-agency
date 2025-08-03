"use client";

import React from 'react';

interface NewSiteViewProps {
  className?: string;
}

export default function NewSiteView({ className = '' }: NewSiteViewProps) {
  return (
    <div className={`${className} bg-background min-h-[600px] overflow-hidden`}
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
                  <a href="#" className="text-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Services
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Portfolio
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    About
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <button className="border border-border text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted hover:text-accent transition-all">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-white" style={{ background: 'linear-gradient(135deg, oklch(0.25 0.03 260) 0%, oklch(0.25 0.03 260) 70%, oklch(0.55 0.12 250) 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Transform Your Digital Presence
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Modern web solutions that drive growth and engage your audience. 
                Fast, secure, and built for success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
                  View Our Work
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary transition-all">
                  Schedule a Call
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg blur-3xl opacity-30" style={{ background: 'linear-gradient(to top right, #60a5fa, #9333ea)' }}></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-full"></div>
                    <div className="h-4 bg-white/20 rounded w-5/6"></div>
                    <div className="h-32 bg-white/10 rounded-lg mt-6"></div>
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
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Optimized for speed with sub-3s load times</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground text-sm">Responsive design that works on all devices</p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
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