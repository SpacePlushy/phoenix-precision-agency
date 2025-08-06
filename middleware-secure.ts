import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders, generateNonce, applyAPISecurityHeaders } from "@/lib/security/headers";
import { getClientIP, AttackDetector } from "@/lib/security/rate-limit";

/**
 * Enhanced middleware with comprehensive security features
 * This is a more secure version of the current middleware.ts
 * 
 * To activate:
 * 1. Rename current middleware.ts to middleware-backup.ts
 * 2. Rename this file to middleware.ts
 */

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check for blocked IPs (DDoS protection)
  const clientIP = getClientIP(req);
  const isBlocked = await AttackDetector.isBlocked(clientIP);
  
  if (isBlocked) {
    return new NextResponse(
      JSON.stringify({ error: 'Access denied' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // Monitor for potential attacks
  const isAttack = await AttackDetector.checkForAttack(clientIP);
  if (isAttack) {
    await AttackDetector.blockIdentifier(clientIP, 3600); // Block for 1 hour
    console.warn(`Potential attack detected from IP: ${clientIP}`);
  }
  
  // Get the response
  const response = NextResponse.next();
  
  // Apply different security headers based on route type
  if (pathname.startsWith("/api/")) {
    // API routes get stricter headers
    applyAPISecurityHeaders(response);
    
    // Add CORS headers if needed (configure allowed origins)
    const origin = req.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['https://phoenix-precision-agency.vercel.app'];
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
  } else {
    // Generate nonce for CSP (for non-API routes)
    const nonce = generateNonce();
    
    // Store nonce in response header for use in components
    response.headers.set('X-CSP-Nonce', nonce);
    
    // Apply comprehensive security headers
    applySecurityHeaders(response, {
      nonce,
      isDevelopment: process.env.NODE_ENV === 'development',
      reportUri: process.env.CSP_REPORT_URI,
    });
  }
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
  
  // Log security events (in production, send to monitoring service)
  if (process.env.NODE_ENV === 'production') {
    logSecurityEvent({
      requestId,
      clientIP,
      pathname,
      method: req.method,
      timestamp: new Date().toISOString(),
      isBlocked: false,
      isPotentialAttack: isAttack,
    });
  }
  
  return response;
}

/**
 * Log security events for monitoring
 */
function logSecurityEvent(event: {
  requestId: string;
  clientIP: string;
  pathname: string;
  method: string;
  timestamp: string;
  isBlocked: boolean;
  isPotentialAttack: boolean;
}) {
  // In production, send to logging service (e.g., Datadog, Sentry)
  // For now, console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', event);
  }
  
  // TODO: Integrate with monitoring service
  // Example: await sendToDatadog(event);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)$).*)',
  ],
};