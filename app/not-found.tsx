'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Phoenix Logo */}
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-primary-foreground font-bold text-xl">PA</span>
        </div>

        {/* 404 Content */}
        <div className="bg-card rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>

          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Suggested Actions */}
          <div className="bg-accent/10 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-accent mb-2">What you can do:</h3>
            <ul className="text-sm text-accent/90 space-y-1">
              <li>• Check the URL for spelling errors</li>
              <li>• Go back to the previous page</li>
              <li>• Visit our homepage</li>
              <li>• Contact us if you think this is an error</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go back home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Popular Pages */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2 font-medium">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/portfolio" className="text-primary hover:text-primary/80">
                Portfolio
              </Link>
              <Link href="/contact" className="text-primary hover:text-primary/80">
                Contact
              </Link>
              <span className="text-muted-foreground/50">|</span>
              <a 
                href="mailto:fmp321@gmail.com"
                className="text-primary hover:text-primary/80"
              >
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <p className="text-sm text-muted-foreground mt-6">
          <strong>Phoenix Precision Agency</strong><br />
          Professional Web Development & Digital Solutions
        </p>
      </div>
    </div>
  );
}