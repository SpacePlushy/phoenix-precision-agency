import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security headers configuration based on OWASP recommendations
 * Refactored using Next.js best practices for Edge Runtime
 */
const securityHeaders = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "DENY",
  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",
  // Control referrer information
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Legacy XSS protection (for older browsers)
  "X-XSS-Protection": "1; mode=block",
  // Control browser features and APIs
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // DNS prefetch control
  "X-DNS-Prefetch-Control": "off",
  // Enforce HTTPS - critical for security
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * Content Security Policy configuration
 * Note: Next.js requires 'unsafe-inline' for hydration scripts in production
 * We mitigate risks through other strict policies
 */
function getCSPHeader(): string {
  // Base CSP directives for security
  const directives = [
    "default-src 'self'",
    // Scripts: Allow self and necessary external sources
    // 'unsafe-inline' is required for Next.js hydration
    "script-src 'self' 'unsafe-inline' https://vercel.live https://vitals.vercel-insights.com",
    // Styles: Allow self and inline styles (required for styled-jsx)
    "style-src 'self' 'unsafe-inline'",
    // Images: Allow self, data URIs, and HTTPS sources
    "img-src 'self' data: https:",
    // Fonts: Allow self and data URIs
    "font-src 'self' data:",
    // Connections: Allow analytics and development tools
    "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live ws://localhost:* wss://localhost:*",
    // Frames: Only allow same-origin
    "frame-src 'self'",
    // Objects: Block all plugins
    "object-src 'none'",
    // Base URI: Restrict to self
    "base-uri 'self'",
    // Form submissions: Only to same origin
    "form-action 'self'",
    // Frame ancestors: Prevent embedding
    "frame-ancestors 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests",
    // Block mixed content
    "block-all-mixed-content",
  ];

  // Join directives and clean up formatting
  return directives.join("; ");
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Create response
  const response = NextResponse.next();

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Apply CSP to non-API routes
  // API routes typically don't need CSP as they return JSON
  if (!pathname.startsWith("/api/")) {
    const cspHeader = getCSPHeader();
    response.headers.set("Content-Security-Policy", cspHeader);
  }

  // Additional API-specific headers
  if (pathname.startsWith("/api/")) {
    // Prevent API responses from being rendered as HTML
    response.headers.set("Content-Type", "application/json");
    // Disable caching for API routes by default
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Public assets (images, fonts, etc.)
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|otf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};