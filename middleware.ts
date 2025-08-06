import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add security headers for all responses
  const response = NextResponse.next();
  
  // Note: Nonces would require server-side rendering for every request
  // For static/ISR pages, we use a restrictive but practical CSP

  // Security headers based on OWASP recommendations
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  
  // CRITICAL FIX: Add HSTS to ALL routes (not just API routes)
  // This prevents protocol downgrade attacks
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  
  // Additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // CSP Configuration
  // Note: Next.js requires unsafe-inline for hydration. We mitigate with other strict policies.
  if (!pathname.startsWith("/api/")) {
    const cspDirectives = [
      "default-src 'self'",
      // Next.js requires unsafe-inline for proper hydration
      "script-src 'self' 'unsafe-inline' https://vercel.live https://vitals.vercel-insights.com",
      "style-src 'self' 'unsafe-inline'",
      // Allow data: URIs for images (commonly used for placeholders)
      "img-src 'self' data: https:",
      // Font sources
      "font-src 'self' data:",
      // Allow connections to self and Vercel analytics
      "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live",
      // Frame sources
      "frame-src 'self'",
      // Object sources (plugins)
      "object-src 'none'",
      // Base URI
      "base-uri 'self'",
      // Form actions
      "form-action 'self'",
      // Frame ancestors (clickjacking protection)
      "frame-ancestors 'none'",
      // Upgrade insecure requests
      "upgrade-insecure-requests",
      // Block all mixed content
      "block-all-mixed-content",
      // Report violations (optional)
      ...(process.env.CSP_REPORT_URI ? [`report-uri ${process.env.CSP_REPORT_URI}`] : [])
    ];
    
    response.headers.set(
      "Content-Security-Policy",
      cspDirectives.join("; ")
    );
    
    // Report-Only CSP for monitoring (optional, for gradual rollout)
    if (process.env.CSP_REPORT_URI) {
      response.headers.set(
        "Content-Security-Policy-Report-Only",
        `${cspDirectives.join("; ")}; report-uri ${process.env.CSP_REPORT_URI}`
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
