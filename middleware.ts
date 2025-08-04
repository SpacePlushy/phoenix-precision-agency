import { NextResponse, type NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/dashboard(.*)',
])

// Generate Content Security Policy based on environment
const getCSPHeader = (isDevelopment: boolean) => {
  // Get Clerk instance domain from environment or use default pattern
  const clerkDomain = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
    ? `https://${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.split('_')[1]}.clerk.accounts.dev`
    : 'https://*.clerk.accounts.dev';
  
  const directives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required by Next.js and Clerk
      clerkDomain,
      'https://clerk.com',
      'https://challenges.cloudflare.com',
      ...(isDevelopment ? ['https://vercel.live'] : []),
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required by Clerk components
      clerkDomain,
    ],
    'img-src': [
      "'self'",
      'data:',
      'https://img.clerk.com',
      'https://images.clerk.dev',
      'https://www.gravatar.com', // Common for user avatars
    ],
    'font-src': [
      "'self'",
      'data:',
      clerkDomain,
    ],
    'connect-src': [
      "'self'",
      clerkDomain,
      'https://clerk.com',
      'https://api.clerk.com',
      'https://clerk-telemetry.com',
      'https://*.clerk-telemetry.com',
      ...(isDevelopment ? ['ws://localhost:*', 'wss://localhost:*'] : []),
    ],
    'frame-src': [
      "'self'",
      'https://challenges.cloudflare.com',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };
  
  // Add upgrade-insecure-requests in production
  if (!isDevelopment) {
    directives['upgrade-insecure-requests'] = [];
  }
  
  // Convert directives object to CSP string
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

// Combine Clerk middleware with custom middleware
export default clerkMiddleware((auth, req: NextRequest) => {
  const { pathname } = req.nextUrl
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Protect dashboard routes with Clerk authentication
  if (isProtectedRoute(req)) {
    auth.protect()
  }
  
  // Add security headers for all responses
  const response = NextResponse.next()
  
  // Security headers based on OWASP recommendations
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Only set CSP for non-API routes to avoid conflicts
  if (!pathname.startsWith('/api/')) {
    response.headers.set('Content-Security-Policy', getCSPHeader(isDevelopment))
  }
  
  // Add security headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-DNS-Prefetch-Control', 'off')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
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