import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0c1221] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-8 w-full">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your dashboard
          </p>
        </div>
        
        <div className="w-full flex justify-center">
          <SignIn 
            afterSignInUrl="/dashboard"
            appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#1a1f2e] border border-gray-800 shadow-xl mx-auto",
              formButtonPrimary: 
                "bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: 
                "bg-gray-800 text-white border-gray-700 hover:bg-gray-700 transition-colors",
              formFieldLabel: "text-gray-300 font-medium",
              formFieldInput: 
                "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              footerActionLink: "text-blue-400 hover:text-blue-300 transition-colors font-medium",
              identityPreviewText: "text-gray-400",
              identityPreviewEditButtonIcon: "text-blue-400",
              formHeaderTitle: "hidden",
              formHeaderSubtitle: "hidden",
              otpCodeFieldInput: "border-gray-700 text-white bg-gray-900",
              formResendCodeLink: "text-blue-400 hover:text-blue-300",
              dividerLine: "bg-gray-800",
              dividerText: "text-gray-500 bg-[#1a1f2e]",
              formFieldError: "text-red-400",
              formFieldSuccessText: "text-green-400",
              alertText: "text-gray-300",
              backdropBlur: "backdrop-blur-sm",
              formFieldInputShowPasswordButton: "text-gray-400 hover:text-gray-300",
              footer: "hidden",
              logoImage: "hidden",
              logoBox: "hidden",
            },
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "blockButton",
              logoPlacement: "none",
              showOptionalFields: false,
            },
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#1a1f2e",
              colorText: "#f3f4f6",
              colorTextSecondary: "#9ca3af",
              colorDanger: "#ef4444",
              colorSuccess: "#10b981",
              colorInputBackground: "#111827",
              colorInputText: "#f3f4f6",
              borderRadius: "0.5rem",
              fontSize: "16px",
            }
          }}
          />
        </div>
      </div>
    </div>
  );
}