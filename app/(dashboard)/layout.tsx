// This layout will wrap all dashboard pages with Clerk authentication
// TODO: Install and configure Clerk authentication

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clerk auth wrapper will be added here */}
      {/* <ClerkProvider>
        <SignedIn> */}
      <div className="flex">
        {/* Sidebar navigation placeholder */}
        <aside className="w-64 bg-white shadow-md h-screen">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Client Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2">
              Authentication coming soon...
            </p>
          </div>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      {/* </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkProvider> */}
    </div>
  );
}