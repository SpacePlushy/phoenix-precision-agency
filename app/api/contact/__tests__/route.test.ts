/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => {
    const request = new Request(url, init);
    return {
      ...request,
      json: () => request.json(),
      headers: request.headers,
      ip: '127.0.0.1',
    };
  }),
  NextResponse: {
    json: jest.fn((body, init) => {
      const response = new Response(JSON.stringify(body), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init?.headers || {}),
        },
      });
      return response;
    }),
  },
}));

// Mock rate limiter
const mockRateLimiter = {
  limit: jest.fn(),
};

jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    jest.fn(() => mockRateLimiter),
    {
      slidingWindow: jest.fn(() => 'sliding-window-config'),
    }
  ),
}));

// Mock Redis and upstash functions
const mockStoreLead = jest.fn();
jest.mock('@/lib/upstash', () => ({
  redis: {
    pipeline: jest.fn(),
  },
  storeLead: mockStoreLead,
  STORAGE_KEYS: {
    lead: (id: string) => `lead:${id}`,
    leadsList: 'leads:list',
  },
}));

// Mock Resend
const mockSend = jest.fn();
const mockResendInstance = {
  emails: {
    send: mockSend,
  },
};

jest.mock('resend', () => ({
  Resend: jest.fn(() => mockResendInstance),
}));

// Set up default env vars before importing
process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:8079';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

// Mock the getResendInstance before importing
jest.mock('../route', () => {
  const originalModule = jest.requireActual('../route');
  return {
    ...originalModule,
    getResendInstance: jest.fn(() => {
      if (process.env.RESEND_API_KEY) {
        return {
          emails: {
            send: jest.fn(),
          },
        };
      }
      return null;
    }),
  };
});

// Import the route handlers after mocks are set up
const { POST, GET, getResendInstance } = require('../route');

// Set up the mock send function
const mockGetResendInstance = getResendInstance as jest.MockedFunction<typeof getResendInstance>;
mockGetResendInstance.mockImplementation(() => {
  if (process.env.RESEND_API_KEY) {
    return mockResendInstance;
  }
  return null;
});

describe('/api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset rate limiter to default allow state
    mockRateLimiter.limit.mockResolvedValue({
      success: true,
      limit: 3,
      remaining: 2,
      reset: Date.now() + 3600000,
    });
    
    // Reset email mock
    mockSend.mockResolvedValue({ id: 'email-id' });
  });

  describe('POST', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      message: 'This is a test message for the contact form',
    };

    it('successfully processes valid contact form submission', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain('Thank you');
      expect(data.id).toMatch(/^lead_/);
      
      // Verify rate limit headers
      expect(response.headers.get('X-RateLimit-Limit')).toBe('3');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('2');
      
      // Verify storeLead was called with correct data
      expect(mockStoreLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          message: 'This is a test message for the contact form',
          source: 'contact',
          id: expect.stringMatching(/^lead_/),
          createdAt: expect.any(String),
        })
      );
    });

    it('returns 429 when rate limit is exceeded', async () => {
      // Mock rate limiter to block request
      mockRateLimiter.limit.mockResolvedValue({
        success: false,
        limit: 3,
        remaining: 0,
        reset: Date.now() + 3600000,
      });

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Too many requests');
      expect(mockStoreLead).not.toHaveBeenCalled();
    });

    it('returns 400 for missing required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        // missing email and message
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Missing required fields');
      expect(mockStoreLead).not.toHaveBeenCalled();
    });

    it('returns 400 for invalid email format', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Test message here',
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid email address');
      expect(mockStoreLead).not.toHaveBeenCalled();
    });

    it('returns 400 for name too short', async () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        message: 'Test message here',
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Name must be between 2 and 100 characters');
    });

    it('returns 400 for message too short', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('Message must be between 10 and 1000 characters');
    });

    it('handles email sending failure gracefully', async () => {
      // Mock email send to throw error
      mockSend.mockRejectedValue(new Error('Email service error'));

      // Set environment variables
      process.env.RESEND_API_KEY = 'test-key';
      process.env.CONTACT_EMAIL_TO = 'admin@example.com';

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should still succeed even if email fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockStoreLead).toHaveBeenCalled();
      
      // Clean up env vars
      delete process.env.RESEND_API_KEY;
      delete process.env.CONTACT_EMAIL_TO;
    });

    it('sends email notification when configured', async () => {
      // Set environment variables  
      process.env.RESEND_API_KEY = 'test-key';
      process.env.CONTACT_EMAIL_TO = 'admin@example.com';
      process.env.CONTACT_EMAIL_FROM = 'noreply@example.com';

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@example.com',
        to: 'admin@example.com',
        subject: 'New Contact Form Submission from John Doe',
        html: expect.stringContaining('John Doe'),
      });
      
      // Clean up env vars
      delete process.env.RESEND_API_KEY;
      delete process.env.CONTACT_EMAIL_TO;
      delete process.env.CONTACT_EMAIL_FROM;
    });

    it('handles storage errors', async () => {
      // Mock storeLead to throw error
      mockStoreLead.mockRejectedValueOnce(new Error('Redis connection error'));

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(validData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Internal server error');
      
      // Reset the mock for the next test
      mockStoreLead.mockResolvedValue(undefined);
    });

    it('trims and normalizes input data', async () => {
      const dataWithWhitespace = {
        name: '  John Doe  ',
        email: '  JOHN@EXAMPLE.COM  ',
        phone: '  +1234567890  ',
        company: '  Test Company  ',
        message: '  This is a test message with enough characters to pass validation  ',
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        body: JSON.stringify(dataWithWhitespace),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      
      // Verify data was trimmed and email was lowercased
      expect(mockStoreLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          message: 'This is a test message with enough characters to pass validation',
        })
      );
    });
  });

  describe('GET', () => {
    it('returns 405 Method Not Allowed', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(405);
      expect(data.error).toContain('Method not allowed');
    });
  });
});