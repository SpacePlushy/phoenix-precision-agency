import { checkClerkConfig, getAllServiceConfigs } from '@/lib/env-config'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'

// This layout will wrap all dashboard pages with Clerk authentication
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkConfig = checkClerkConfig()
  const allConfigs = getAllServiceConfigs()
  
  // If Clerk is not configured, show configuration instructions
  if (!clerkConfig.isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Configuration Required</h1>
            <p className="text-gray-600">
              The dashboard requires authentication setup to function properly.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Authentication Not Configured</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Clerk authentication is required for dashboard access. Please set up the following environment variables:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {clerkConfig.missingKeys?.map((key) => (
                  <li key={key} className="font-mono bg-yellow-100 px-2 py-1 rounded">
                    {key}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Service Configuration Status</h3>
              <div className="space-y-2">
                {allConfigs.map((config) => (
                  <div key={config.service} className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">{config.service}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      config.isConfigured 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {config.isConfigured ? 'Configured' : 'Not Configured'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Quick Setup Instructions</h3>
              <ol className="text-sm text-gray-700 space-y-2">
                <li>1. Sign up for a Clerk account at <a href="https://clerk.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">clerk.com</a></li>
                <li>2. Create a new application in your Clerk dashboard</li>
                <li>3. Copy your publishable key and secret key</li>
                <li>4. Update your <code className="bg-gray-200 px-1 rounded">.env.local</code> file with the real values</li>
                <li>5. Restart your development server</li>
              </ol>
            </div>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Marketing Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If Clerk is configured, show the normal dashboard (authentication will be handled by middleware)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          {/* Sidebar navigation */}
          <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-64px)] hidden lg:block">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Manage your website
              </p>
              
              <nav className="mt-8 space-y-2">
                <Link 
                  href="/dashboard" 
                  className="flex items-center px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Overview
                </Link>
                <Link 
                  href="/dashboard/analytics" 
                  className="flex items-center px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </Link>
                <Link 
                  href="/dashboard/leads" 
                  className="flex items-center px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Leads
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center px-4 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </Link>
              </nav>
            </div>
          </aside>
          
          {/* Main content area */}
          <main className="flex-1 p-4 lg:p-8">
            {/* Mobile menu toggle */}
            <div className="lg:hidden mb-4">
              <Button variant="outline" className="w-full justify-start">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Menu
              </Button>
            </div>
            
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}