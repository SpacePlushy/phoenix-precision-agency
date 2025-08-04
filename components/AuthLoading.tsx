"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        
        {/* Form skeleton */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6 shadow-lg">
          {/* Input fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          {/* Submit button */}
          <Skeleton className="h-10 w-full" />
          
          {/* Divider */}
          <div className="flex items-center space-x-4">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-px flex-1" />
          </div>
          
          {/* Social buttons */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Footer link */}
          <div className="text-center">
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}