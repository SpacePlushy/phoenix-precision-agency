"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserMenu() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-foreground">
          {user.firstName || user.username || "User"}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-10 w-10 ring-2 ring-border hover:ring-accent transition-all",
            userButtonTrigger: "focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full",
            userButtonPopoverCard: "bg-card border-border",
            userButtonPopoverActionButton: "hover:bg-muted text-foreground",
            userButtonPopoverActionButtonText: "text-foreground",
            userButtonPopoverActionButtonIcon: "text-muted-foreground",
            userButtonPopoverFooter: "hidden",
            userPreviewMainIdentifier: "text-foreground font-medium",
            userPreviewSecondaryIdentifier: "text-muted-foreground",
            userButtonPopoverCustomItemButton: "hover:bg-muted",
            userButtonPopoverCustomItemButtonIcon: "text-muted-foreground",
            userButtonPopoverCustomItemButtonText: "text-foreground",
          }
        }}
        userProfileProps={{
          appearance: {
            elements: {
              card: "bg-card border-border",
              navbar: "bg-card/50",
              navbarButton: "text-foreground/70 hover:text-foreground data-[active=true]:text-accent",
              headerTitle: "text-foreground",
              formFieldInput: "bg-background border-input text-foreground",
              formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            }
          }
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link 
            label="Dashboard" 
            labelIcon={<DashboardIcon />} 
            href="/dashboard" 
          />
          <UserButton.Action label="manageAccount" />
          <UserButton.Action label="signOut" />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}