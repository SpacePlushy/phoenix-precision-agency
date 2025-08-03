import { NextResponse, type NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/dashboard(.*)',
])

// Combine Clerk middleware with custom middleware
export default clerkMiddleware((auth, req: NextRequest) => {
  const { pathname } = req.nextUrl

  // Protect dashboard routes with Clerk authentication
  if (isProtectedRoute(req)) {
    auth.protect()
  }
  
  // Add security headers for all responses
  const response = NextResponse.next()
  
  // Basic security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  // Only set CSP for non-API routes to avoid conflicts
  if (!pathname.startsWith('/api/')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    )
  }
  
  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Run for dashboard routes
    '/dashboard(.*)',
  ],
}