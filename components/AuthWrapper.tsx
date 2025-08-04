"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthLoading from "./AuthLoading";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({ 
  children, 
  requireAuth = false,
  redirectTo = "/sign-in"
}: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && requireAuth && !isSignedIn) {
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, requireAuth, redirectTo, router]);

  if (!isLoaded) {
    return <AuthLoading />;
  }

  if (requireAuth && !isSignedIn) {
    return <AuthLoading />;
  }

  return <>{children}</>;
}