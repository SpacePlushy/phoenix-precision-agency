"use client";

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Something went wrong
        </h1>
        
        <p className="text-muted-foreground mb-8">
          We&apos;re experiencing a temporary issue. Our team has been notified and is working on a fix.
        </p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-2">Error Details:</h3>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted/50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Support Contact */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a 
              href="mailto:fmp321@gmail.com"
              className="text-accent hover:text-accent/80"
            >
              fmp321@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}