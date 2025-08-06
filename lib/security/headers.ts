import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Security headers configuration following OWASP best practices
 * @see https://owasp.org/www-project-secure-headers/
 */

export interface SecurityHeaderOptions {
  nonce?: string;
  reportUri?: string;
  isDevelopment?: boolean;
}

/**
 * Generate a cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Apply comprehensive security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  options: SecurityHeaderOptions = {}
): NextResponse {
  const { nonce, reportUri, isDevelopment = false } = options;

  // Core security headers (always applied)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  
  // Remove X-XSS-Protection in modern browsers (can cause issues)
  response.headers.set('X-XSS-Protection', '0');
  
  // HSTS with preload (2 years)
  if (!isDevelopment) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }
  
  // Comprehensive Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), ' +
    'microphone=(), ' +
    'geolocation=(), ' +
    'payment=(), ' +
    'usb=(), ' +
    'magnetometer=(), ' +
    'gyroscope=(), ' +
    'accelerometer=(), ' +
    'ambient-light-sensor=(), ' +
    'autoplay=(), ' +
    'encrypted-media=(), ' +
    'picture-in-picture=(), ' +
    'sync-xhr=(), ' +
    'document-domain=(), ' +
    'interest-cohort=()'
  );
  
  // Content Security Policy
  const cspDirectives = buildCSPDirectives(nonce, reportUri, isDevelopment);
  response.headers.set('Content-Security-Policy', cspDirectives);
  
  // Report-Only CSP for monitoring (optional)
  if (reportUri && !isDevelopment) {
    response.headers.set('Content-Security-Policy-Report-Only', cspDirectives);
  }
  
  return response;
}

/**
 * Build CSP directives based on configuration
 */
function buildCSPDirectives(
  nonce?: string,
  reportUri?: string,
  isDevelopment?: boolean
): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'"],
    'frame-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'manifest-src': ["'self'"],
    'worker-src': ["'self'", 'blob:'],
  };

  // Add nonce to script and style sources
  if (nonce) {
    directives['script-src'].push(`'nonce-${nonce}'`);
    directives['style-src'].push(`'nonce-${nonce}'`);
  } else {
    // Fallback for development (less secure)
    if (isDevelopment) {
      directives['script-src'].push("'unsafe-inline'", "'unsafe-eval'");
      directives['style-src'].push("'unsafe-inline'");
    }
  }

  // Add external services
  // Vercel Analytics
  directives['script-src'].push('https://vercel.live', 'https://va.vercel-scripts.com');
  directives['connect-src'].push('https://vercel.live', 'wss://ws.vercel.live', 'https://va.vercel-scripts.com');
  
  // Clerk Authentication
  directives['script-src'].push('https://*.clerk.accounts.dev', 'https://clerk.com');
  directives['connect-src'].push('https://*.clerk.accounts.dev', 'https://clerk.com');
  directives['frame-src'].push('https://accounts.dev', 'https://*.clerk.accounts.dev');
  directives['img-src'].push('https://*.clerk.accounts.dev', 'https://img.clerk.com');
  
  // Upstash Redis
  directives['connect-src'].push('https://*.upstash.io');

  // Build the CSP string
  let csp = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  // Add upgrade-insecure-requests for production
  if (!isDevelopment) {
    csp += '; upgrade-insecure-requests';
  }

  // Add report URI if provided
  if (reportUri) {
    csp += `; report-uri ${reportUri}`;
  }

  return csp;
}

/**
 * Extract nonce from CSP header (for client-side usage)
 */
export function extractNonceFromCSP(csp: string): string | null {
  const match = csp.match(/'nonce-([^']+)'/);
  return match ? match[1] : null;
}

/**
 * Security headers for API routes (stricter)
 */
export function applyAPISecurityHeaders(response: NextResponse): NextResponse {
  // Apply base security headers
  applySecurityHeaders(response, { isDevelopment: process.env.NODE_ENV === 'development' });
  
  // Additional API-specific headers
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('Surrogate-Control', 'no-store');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Remove unnecessary headers for API
  response.headers.delete('X-Frame-Options');
  response.headers.delete('Content-Security-Policy');
  
  return response;
}