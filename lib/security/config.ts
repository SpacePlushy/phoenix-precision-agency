/**
 * Centralized Security Configuration
 * Based on OWASP recommendations and security best practices
 */

export const SecurityConfig = {
  // Rate Limiting Configuration
  rateLimiting: {
    // Contact form: strict limits to prevent spam
    contact: {
      requests: 3,
      window: '1h',
      blockDuration: 3600, // 1 hour block after exceeding
    },
    // General API: reasonable limits for normal usage
    api: {
      requests: 100,
      window: '1m',
      blockDuration: 300, // 5 minute block
    },
    // Analytics: higher limits for frequent updates
    analytics: {
      requests: 1000,
      window: '1h',
      blockDuration: 600, // 10 minute block
    },
    // Admin/sensitive operations: very strict
    admin: {
      requests: 10,
      window: '10m',
      blockDuration: 7200, // 2 hour block
    },
  },

  // CORS Configuration
  cors: {
    // Allowed origins for API access
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      process.env.NEXT_PUBLIC_APP_URL || 'https://phoenix-precision.vercel.app',
    ],
    // Allowed methods
    allowedMethods: ['GET', 'POST', 'OPTIONS'],
    // Allowed headers
    allowedHeaders: ['Content-Type', 'Authorization'],
    // Credentials
    credentials: true,
    // Max age for preflight cache
    maxAge: 86400, // 24 hours
  },

  // Session Configuration
  session: {
    // Session timeout in seconds
    timeout: 3600, // 1 hour
    // Sliding session (extends on activity)
    sliding: true,
    // Session cookie settings
    cookie: {
      name: '__session',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 3600,
    },
  },

  // Input Validation Limits
  validation: {
    // Maximum lengths for form fields
    maxLengths: {
      name: 100,
      email: 254, // RFC 5321
      phone: 30,
      company: 100,
      message: 1000,
      subject: 200,
    },
    // Minimum lengths
    minLengths: {
      name: 2,
      message: 10,
      password: 12, // If implementing auth
    },
    // File upload limits (if implementing file uploads)
    fileUpload: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    },
  },

  // Security Headers Configuration
  headers: {
    // HSTS Configuration
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    // CSP Configuration
    csp: {
      // Report URI for CSP violations (optional)
      reportUri: process.env.CSP_REPORT_URI,
      // Directives are configured in middleware.ts
    },
    // Additional headers
    frameOptions: 'DENY',
    contentTypeOptions: 'nosniff',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      camera: false,
      microphone: false,
      geolocation: false,
      payment: false,
      usb: false,
      magnetometer: false,
      gyroscope: false,
      accelerometer: false,
    },
  },

  // IP Detection Configuration
  ipDetection: {
    // Trust proxy headers (for Vercel/cloud deployments)
    trustProxy: process.env.VERCEL === '1' || process.env.TRUST_PROXY === 'true',
    // Headers to check in order of preference
    headerPriority: [
      'x-forwarded-for', // Standard proxy header
      'x-real-ip', // Nginx
      'cf-connecting-ip', // Cloudflare
      'x-client-ip', // Various proxies
      'x-forwarded', // Standard
      'forwarded-for', // Variations
      'forwarded', // RFC 7239
    ],
    // Use fingerprinting as fallback
    enableFingerprinting: true,
  },

  // Attack Detection Thresholds
  attackDetection: {
    // Requests per minute to trigger attack detection
    requestsPerMinute: 50,
    // Block duration for detected attacks (seconds)
    blockDuration: 3600, // 1 hour
    // Patterns that indicate malicious activity
    suspiciousPatterns: [
      // SQL Injection patterns
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)/i,
      // XSS patterns
      /<script[\s\S]*?>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      // Command injection
      /(\||;|`|\$\(|<\()/,
      // Path traversal
      /\.\.[\/\\]/,
      // LDAP injection
      /[*()\\]/,
    ],
  },

  // Encryption Configuration
  encryption: {
    // Fields to encrypt in database
    encryptedFields: ['email', 'phone', 'address', 'ssn', 'creditCard'],
    // Algorithm
    algorithm: 'aes-256-gcm',
    // Key derivation
    keyDerivation: {
      iterations: 100000,
      saltLength: 32,
      keyLength: 32,
    },
  },

  // Monitoring & Logging
  monitoring: {
    // Log security events
    logSecurityEvents: true,
    // Events to log
    events: [
      'rate_limit_exceeded',
      'suspicious_input',
      'attack_detected',
      'authentication_failed',
      'unauthorized_access',
      'csp_violation',
    ],
    // Alert thresholds
    alerts: {
      rateLimitExceeded: 10, // Alert after 10 rate limit violations
      failedAuth: 5, // Alert after 5 failed auth attempts
      suspiciousActivity: 3, // Alert after 3 suspicious activities
    },
  },
};

// Helper function to get security config
export function getSecurityConfig<T extends keyof typeof SecurityConfig>(
  key: T
): typeof SecurityConfig[T] {
  return SecurityConfig[key];
}

// Validate environment configuration
export function validateSecurityConfig(): void {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check for encryption key
  if (!process.env.ENCRYPTION_KEY) {
    warnings.push('ENCRYPTION_KEY not set - PII encryption disabled');
  }

  // Check for HTTPS in production
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_APP_URL?.startsWith('https')) {
    errors.push('Production URL must use HTTPS');
  }

  // Check for CSP report URI
  if (!process.env.CSP_REPORT_URI) {
    warnings.push('CSP_REPORT_URI not set - CSP violations will not be reported');
  }

  // Log results
  if (errors.length > 0) {
    console.error('Security Configuration Errors:', errors);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Security configuration validation failed');
    }
  }

  if (warnings.length > 0) {
    console.warn('Security Configuration Warnings:', warnings);
  }
}

// Export for use in middleware and API routes
export default SecurityConfig;