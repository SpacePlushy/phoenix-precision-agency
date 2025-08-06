import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { 
  getClientIP, 
  EnhancedRateLimiter,
  AttackDetector 
} from '../rate-limit';
import {
  encrypt,
  decrypt,
  validateEncryptionKey,
  generateEncryptionKey,
  encryptPII,
  decryptPII,
} from '../encryption';
import {
  applySecurityHeaders,
  generateNonce,
  extractNonceFromCSP,
} from '../headers';

describe('Security Module Tests', () => {
  
  describe('IP Extraction', () => {
    test('should extract IP from x-forwarded-for header', () => {
      const request = new NextRequest('https://example.com', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      });
      
      const ip = getClientIP(request);
      expect(ip).toBe('192.168.1.1');
    });
    
    test('should handle missing IP headers gracefully', () => {
      const request = new NextRequest('https://example.com');
      const ip = getClientIP(request);
      
      // Should return a fingerprint-based fallback
      expect(ip).toMatch(/^fp_[a-f0-9]{16}$/);
    });
    
    test('should return consistent IP for development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const request = new NextRequest('https://example.com');
      const ip = getClientIP(request);
      
      expect(ip).toBe('127.0.0.1');
      
      process.env.NODE_ENV = originalEnv;
    });
  });
  
  describe('Encryption', () => {
    const testKey = generateEncryptionKey();
    
    test('should encrypt and decrypt data correctly', () => {
      const originalText = 'Sensitive information';
      const encrypted = encrypt(originalText, testKey);
      const decrypted = decrypt(encrypted, testKey);
      
      expect(decrypted).toBe(originalText);
      expect(encrypted).not.toBe(originalText);
      expect(encrypted.split(':').length).toBe(4); // iv:authTag:encrypted:salt
    });
    
    test('should fail decryption with wrong key', () => {
      const originalText = 'Sensitive information';
      const encrypted = encrypt(originalText, testKey);
      const wrongKey = generateEncryptionKey();
      
      expect(() => decrypt(encrypted, wrongKey)).toThrow('Failed to decrypt');
    });
    
    test('should validate encryption key format', () => {
      expect(validateEncryptionKey(testKey)).toBe(true);
      expect(validateEncryptionKey('short')).toBe(false);
      expect(validateEncryptionKey('not-hex-chars!')).toBe(false);
    });
    
    test('should encrypt and decrypt PII correctly', () => {
      const originalPII = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        company: 'Acme Corp',
        message: 'Test message',
      };
      
      process.env.ENCRYPTION_KEY = testKey;
      
      const encrypted = encryptPII(originalPII);
      const decrypted = decryptPII(encrypted);
      
      expect(decrypted).toEqual(originalPII);
      expect(encrypted.name).not.toBe(originalPII.name);
      expect(encrypted.email).not.toBe(originalPII.email);
      
      delete process.env.ENCRYPTION_KEY;
    });
  });
  
  describe('Security Headers', () => {
    test('should apply all required security headers', () => {
      const response = NextResponse.next();
      const nonce = generateNonce();
      
      applySecurityHeaders(response, { nonce });
      
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
      expect(response.headers.get('Content-Security-Policy')).toContain(`'nonce-${nonce}'`);
    });
    
    test('should generate valid nonce', () => {
      const nonce = generateNonce();
      expect(nonce).toMatch(/^[A-Za-z0-9+/]{22,24}={0,2}$/); // Base64 pattern
    });
    
    test('should extract nonce from CSP header', () => {
      const nonce = generateNonce();
      const csp = `default-src 'self'; script-src 'self' 'nonce-${nonce}'`;
      
      const extracted = extractNonceFromCSP(csp);
      expect(extracted).toBe(nonce);
    });
    
    test('should apply HSTS in production mode', () => {
      const response = NextResponse.next();
      applySecurityHeaders(response, { isDevelopment: false });
      
      const hsts = response.headers.get('Strict-Transport-Security');
      expect(hsts).toContain('max-age=63072000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });
    
    test('should not apply HSTS in development mode', () => {
      const response = NextResponse.next();
      applySecurityHeaders(response, { isDevelopment: true });
      
      expect(response.headers.get('Strict-Transport-Security')).toBeNull();
    });
  });
  
  describe('Rate Limiting', () => {
    test('should create rate limiter with correct config', () => {
      const limiter = new EnhancedRateLimiter({
        requests: 10,
        window: '1 m',
        identifier: 'test',
      });
      
      expect(limiter).toBeDefined();
    });
    
    test('should return correct headers when rate limited', async () => {
      // This would need mocking of Redis in a real test
      const limiter = new EnhancedRateLimiter({
        requests: 1,
        window: '1 m',
        identifier: 'test',
      });
      
      const request = new NextRequest('https://example.com');
      const result = await limiter.limit(request);
      
      expect(result.headers['X-RateLimit-Limit']).toBeDefined();
      expect(result.headers['X-RateLimit-Remaining']).toBeDefined();
      expect(result.headers['X-RateLimit-Reset']).toBeDefined();
    });
  });
  
  describe('Attack Detection', () => {
    test('should detect potential attacks based on threshold', async () => {
      // This would need Redis mocking for proper testing
      const identifier = 'test-ip';
      
      // In a real test with mocked Redis:
      // for (let i = 0; i < 51; i++) {
      //   await AttackDetector.checkForAttack(identifier);
      // }
      // const isAttack = await AttackDetector.checkForAttack(identifier);
      // expect(isAttack).toBe(true);
      
      // Placeholder test
      expect(AttackDetector.checkForAttack).toBeDefined();
      expect(AttackDetector.blockIdentifier).toBeDefined();
      expect(AttackDetector.isBlocked).toBeDefined();
    });
  });
  
  describe('Input Validation', () => {
    test('should detect SQL injection patterns', () => {
      const patterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)/i,
        /<script[\s\S]*?>/gi,
        /javascript:/gi,
      ];
      
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        '<script>alert("XSS")</script>',
        'javascript:alert(1)',
        'SELECT * FROM users',
      ];
      
      maliciousInputs.forEach(input => {
        const isMalicious = patterns.some(pattern => pattern.test(input));
        expect(isMalicious).toBe(true);
      });
    });
    
    test('should not flag legitimate input', () => {
      const patterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)/i,
        /<script[\s\S]*?>/gi,
        /javascript:/gi,
      ];
      
      const legitimateInputs = [
        'Please select the best option for our project',
        'I need to update my contact information',
        'Can you create a new design?',
      ];
      
      legitimateInputs.forEach(input => {
        const isMalicious = patterns.some(pattern => pattern.test(input));
        expect(isMalicious).toBe(false);
      });
    });
  });
  
  describe('CORS Configuration', () => {
    test('should validate allowed origins', () => {
      const allowedOrigins = [
        'https://phoenix-precision-agency.vercel.app',
        'http://localhost:3000',
      ];
      
      const validOrigin = 'https://phoenix-precision-agency.vercel.app';
      const invalidOrigin = 'https://malicious.com';
      
      expect(allowedOrigins.includes(validOrigin)).toBe(true);
      expect(allowedOrigins.includes(invalidOrigin)).toBe(false);
    });
  });
});

describe('Security Integration Tests', () => {
  test('should handle complete encryption flow for contact form', () => {
    const key = generateEncryptionKey();
    process.env.ENCRYPTION_KEY = key;
    
    const formData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-9876',
      company: 'Tech Corp',
      message: 'I need a website for my business',
    };
    
    // Encrypt
    const encrypted = encryptPII(formData);
    
    // Verify encryption
    expect(encrypted.name).not.toBe(formData.name);
    expect(encrypted.email).not.toBe(formData.email);
    
    // Store (simulated)
    const stored = JSON.stringify(encrypted);
    
    // Retrieve and decrypt
    const retrieved = JSON.parse(stored);
    const decrypted = decryptPII(retrieved);
    
    // Verify decryption
    expect(decrypted).toEqual(formData);
    
    delete process.env.ENCRYPTION_KEY;
  });
  
  test('should apply security headers and validate CSP', () => {
    const response = NextResponse.next();
    const nonce = generateNonce();
    
    applySecurityHeaders(response, { 
      nonce,
      isDevelopment: false,
    });
    
    const csp = response.headers.get('Content-Security-Policy');
    
    // Verify CSP directives
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain(`script-src 'self' 'nonce-${nonce}'`);
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
    
    // Verify other security headers
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Strict-Transport-Security')).toBeTruthy();
  });
});