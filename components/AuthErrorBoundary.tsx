"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Auth error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isAuthError = 
        this.state.error?.message?.toLowerCase().includes("auth") ||
        this.state.error?.message?.toLowerCase().includes("clerk");

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {isAuthError ? "Authentication Error" : "Something went wrong"}
              </h1>
              <p className="text-muted-foreground">
                {isAuthError 
                  ? "We encountered an issue with authentication. Please try again."
                  : "An unexpected error occurred. Please refresh the page or try again later."}
              </p>
            </div>
            
            {isAuthError && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Error: {this.state.error?.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}