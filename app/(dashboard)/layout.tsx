import { checkClerkConfig, getAllServiceConfigs } from '@/lib/env-config'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar navigation */}
        <aside className="w-64 bg-white shadow-md h-screen">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Client Dashboard</h2>
            <p className="text-sm text-gray-500 mt-2">
              Authentication is active
            </p>
          </div>
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}