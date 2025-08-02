import { NextResponse, type NextRequest } from 'next/server'

// Check if Clerk is properly configured
function isClerkConfigured() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  
  return !!(publishableKey && 
         secretKey && 
         publishableKey !== 'your_clerk_publishable_key_here' &&
         secretKey !== 'your_clerk_secret_key_here' &&
         publishableKey.startsWith('pk_'))
}

// Initialize Clerk middleware only if configured
let clerkMiddlewareInstance: any = null

if (isClerkConfigured()) {
  try {
    const { clerkMiddleware, createRouteMatcher } = require('@clerk/nextjs/server')
    
    const isProtectedRoute = createRouteMatcher([
      '/dashboard(.*)',
      '/api/protected(.*)',
    ])

    clerkMiddlewareInstance = clerkMiddleware((auth: any, req: any) => {
      if (isProtectedRoute(req)) {
        auth.protect()
      }
    })
  } catch (error) {
    console.warn('Failed to initialize Clerk middleware:', error)
  }
}

// Main middleware function
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // If Clerk is not configured, allow all requests through
  if (!isClerkConfigured() || !clerkMiddlewareInstance) {
    return NextResponse.next()
  }

  // If Clerk is configured, use the initialized middleware
  return clerkMiddlewareInstance(req)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}