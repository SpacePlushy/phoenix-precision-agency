import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        
        <SignIn 
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
              card: "bg-card border border-border shadow-lg",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: 
                "bg-muted text-foreground border-border hover:bg-muted/80 transition-colors",
              formFieldLabel: "text-foreground",
              formFieldInput: 
                "bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent",
              footerActionLink: "text-accent hover:text-accent/80 transition-colors",
              identityPreviewText: "text-muted-foreground",
              identityPreviewEditButtonIcon: "text-accent",
              formHeaderTitle: "text-foreground",
              formHeaderSubtitle: "text-muted-foreground",
              otpCodeFieldInput: "border-input text-foreground",
              formResendCodeLink: "text-accent hover:text-accent/80",
              dividerLine: "bg-border",
              dividerText: "text-muted-foreground",
              formFieldError: "text-destructive",
              formFieldSuccessText: "text-green-500",
              alertText: "text-foreground",
              backdropBlur: "backdrop-blur-sm",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
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