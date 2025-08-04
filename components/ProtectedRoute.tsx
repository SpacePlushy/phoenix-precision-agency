"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthLoading from "./AuthLoading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/sign-in" 
}: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isRedirecting) {
      setIsRedirecting(true);
      
      // Store the current path to redirect back after sign in
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect_url=${encodeURIComponent(currentPath)}`;
      
      router.push(redirectUrl);
    }
  }, [isLoaded, isSignedIn, redirectTo, router, isRedirecting]);

  // Show loading state while checking auth
  if (!isLoaded || (!isSignedIn && !isRedirecting)) {
    return <AuthLoading />;
  }

  // If signed in, show the protected content
  if (isSignedIn) {
    return <>{children}</>;
  }

  // While redirecting, show loading
  return <AuthLoading />;
}