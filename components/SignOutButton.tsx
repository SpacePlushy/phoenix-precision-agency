"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogOut } from "lucide-react";

interface SignOutButtonProps {
  variant?: "default" | "ghost" | "outline";
  showIcon?: boolean;
  className?: string;
}

export default function SignOutButton({ 
  variant = "ghost", 
  showIcon = true,
  className = ""
}: SignOutButtonProps) {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={`${className} ${isSigningOut ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {isSigningOut ? "Signing out..." : "Sign Out"}
    </Button>
  );
}