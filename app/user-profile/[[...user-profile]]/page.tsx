import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile and preferences
          </p>
        </div>
        
        <UserProfile 
          appearance={{
            elements: {
              card: "bg-card border border-border shadow-lg",
              navbar: "bg-card/50",
              navbarButton: "text-foreground/70 hover:text-foreground data-[active=true]:text-accent",
              navbarButtonIcon: "text-current",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formButtonPrimary: 
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              formButtonReset: 
                "text-muted-foreground hover:text-foreground transition-colors",
              formFieldLabel: "text-foreground",
              formFieldInput: 
                "bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent",
              formFieldAction: "text-accent hover:text-accent/80",
              badge: "bg-accent/10 text-accent border-accent/20",
              tableHead: "text-muted-foreground",
              tableCellText: "text-foreground",
              avatarImageActionsUpload: "text-accent hover:text-accent/80",
              avatarImageActionsRemove: "text-destructive hover:text-destructive/80",
              profileSectionTitle: "text-foreground",
              profileSectionContent: "text-muted-foreground",
              accordionTriggerButton: "text-foreground hover:text-foreground/80",
              accordionContent: "text-muted-foreground",
              membershipRole: "text-accent",
              formFieldError: "text-destructive",
              formFieldSuccessText: "text-green-500",
              alertText: "text-foreground",
              backdropBlur: "backdrop-blur-sm",
            },
            variables: {
              colorPrimary: "hsl(var(--primary))",
              colorBackground: "hsl(var(--card))",
              colorText: "hsl(var(--foreground))",
              colorTextSecondary: "hsl(var(--muted-foreground))",
              colorDanger: "hsl(var(--destructive))",
              colorSuccess: "#10b981",
              colorInputBackground: "hsl(var(--background))",
              colorInputText: "hsl(var(--foreground))",
              borderRadius: "0.5rem",
            }
          }}
        />
      </div>
    </div>
  );
}