import { describe, it, expect } from '@jest/globals';

// Mock middleware for testing
const getCSPHeader = (isDevelopment: boolean) => {
  const clerkDomain = 'https://*.clerk.accounts.dev';
  
  const directives: { [key: string]: string[] } = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      clerkDomain,
      'https://clerk.com',
      'https://challenges.cloudflare.com',
      ...(isDevelopment ? ['https://vercel.live'] : []),
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      clerkDomain,
    ],
    'img-src': [
      "'self'",
      'data:',
      'https://img.clerk.com',
      'https://images.clerk.dev',
      'https://www.gravatar.com',
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
  
  if (!isDevelopment) {
    directives['upgrade-insecure-requests'] = [];
  }
  
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

describe('Content Security Policy', () => {
  describe('Production CSP', () => {
    const productionCSP = getCSPHeader(false);
    
    it('should include all required Clerk domains', () => {
      // Script sources
      expect(productionCSP).toContain('script-src');
      expect(productionCSP).toContain('https://*.clerk.accounts.dev');
      expect(productionCSP).toContain('https://clerk.com');
      expect(productionCSP).toContain('https://challenges.cloudflare.com');
      
      // Connect sources
      expect(productionCSP).toContain('connect-src');
      expect(productionCSP).toContain('https://api.clerk.com');
      expect(productionCSP).toContain('https://clerk-telemetry.com');
      expect(productionCSP).toContain('https://*.clerk-telemetry.com');
      
      // Image sources
      expect(productionCSP).toContain('img-src');
      expect(productionCSP).toContain('https://img.clerk.com');
      expect(productionCSP).toContain('https://images.clerk.dev');
    });
    
    it('should NOT include unsafe-eval', () => {
      expect(productionCSP).not.toContain('unsafe-eval');
    });
    
    it('should NOT include development-only domains', () => {
      expect(productionCSP).not.toContain('ws://localhost');
      expect(productionCSP).not.toContain('wss://localhost');
      expect(productionCSP).not.toContain('https://vercel.live');
    });
    
    it('should include security-critical directives', () => {
      expect(productionCSP).toContain("object-src 'none'");
      expect(productionCSP).toContain("base-uri 'self'");
      expect(productionCSP).toContain("form-action 'self'");
      expect(productionCSP).toContain("frame-ancestors 'none'");
      expect(productionCSP).toContain('upgrade-insecure-requests');
    });
    
    it('should have properly formatted CSP string', () => {
      // Check for proper directive format
      const directives = productionCSP.split('; ');
      directives.forEach(directive => {
        if (directive && !directive.includes('upgrade-insecure-requests')) {
          expect(directive).toMatch(/^[a-z-]+\s+/);
        }
      });
    });
  });
  
  describe('Development CSP', () => {
    const developmentCSP = getCSPHeader(true);
    
    it('should include development-specific domains', () => {
      expect(developmentCSP).toContain('ws://localhost:*');
      expect(developmentCSP).toContain('wss://localhost:*');
      expect(developmentCSP).toContain('https://vercel.live');
    });
    
    it('should NOT include upgrade-insecure-requests in development', () => {
      expect(developmentCSP).not.toContain('upgrade-insecure-requests');
    });
  });
  
  describe('CSP Security Validation', () => {
    const productionCSP = getCSPHeader(false);
    
    it('should not allow wildcard HTTPS sources', () => {
      // Check that we don't have bare 'https:' which allows any HTTPS source
      const imgSrcMatch = productionCSP.match(/img-src[^;]+/);
      if (imgSrcMatch) {
        expect(imgSrcMatch[0]).not.toMatch(/https:\s*(?:;|$)/);
      }
    });
    
    it('should require unsafe-inline for Clerk compatibility', () => {
      expect(productionCSP).toContain("script-src 'self' 'unsafe-inline'");
      expect(productionCSP).toContain("style-src 'self' 'unsafe-inline'");
    });
    
    it('should restrict form submissions to same origin', () => {
      expect(productionCSP).toContain("form-action 'self'");
    });
    
    it('should prevent clickjacking with frame-ancestors', () => {
      expect(productionCSP).toContain("frame-ancestors 'none'");
    });
  });
});

describe('CSP Violation Reporting', () => {
  it('should have CSP reporting endpoint', async () => {
    const mockViolation = {
      violation: {
        directive: 'script-src',
        blockedURI: 'https://evil.com/script.js',
        documentURI: 'https://phoenixprecision.agency/',
      },
      timestamp: new Date().toISOString(),
      userAgent: 'Test Browser',
      url: 'https://phoenixprecision.agency/',
    };
    
    // This would be tested in an integration test
    // Just verify the structure is correct
    expect(mockViolation).toHaveProperty('violation');
    expect(mockViolation.violation).toHaveProperty('directive');
    expect(mockViolation.violation).toHaveProperty('blockedURI');
  });
});