import { NextRequest, NextResponse } from 'next/server';
import middleware from '../middleware';
import { clerkMiddleware } from '@clerk/nextjs/server';

// Mock Clerk middleware
jest.mock('@clerk/nextjs/server', () => ({
  clerkMiddleware: jest.fn((handler) => handler),
  createRouteMatcher: jest.fn((patterns) => {
    return (req: NextRequest) => {
      const pathname = req.nextUrl.pathname;
      return patterns.some((pattern: string) => {
        const regex = new RegExp(pattern.replace('(.*)', '.*'));
        return regex.test(pathname);
      });
    };
  }),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({
      headers: {
        set: jest.fn(),
      },
    })),
  },
}));

describe('Middleware', () => {
  let mockAuth: any;
  let mockRequest: NextRequest;
  let mockResponse: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuth = {
      protect: jest.fn(),
    };

    mockResponse = {
      headers: {
        set: jest.fn(),
      },
    };

    (NextResponse.next as jest.Mock).mockReturnValue(mockResponse);
  });

  const createMockRequest = (pathname: string) => {
    return {
      nextUrl: {
        pathname,
      },
    } as NextRequest;
  };

  describe('Protected Routes', () => {
    it('protects dashboard routes', () => {
      mockRequest = createMockRequest('/dashboard');
      
      // Get the handler function that clerkMiddleware would call
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('protects dashboard sub-routes', () => {
      mockRequest = createMockRequest('/dashboard/settings');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('protects dashboard API routes', () => {
      mockRequest = createMockRequest('/api/dashboard/stats');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('does not protect public routes', () => {
      mockRequest = createMockRequest('/');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).not.toHaveBeenCalled();
    });

    it('does not protect portfolio routes', () => {
      mockRequest = createMockRequest('/portfolio');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).not.toHaveBeenCalled();
    });

    it('does not protect contact routes', () => {
      mockRequest = createMockRequest('/contact');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).not.toHaveBeenCalled();
    });
  });

  describe('Security Headers', () => {
    it('adds security headers to all responses', () => {
      mockRequest = createMockRequest('/');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      const response = handler(mockAuth, mockRequest);

      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Frame-Options', 'DENY');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('X-Content-Type-Options', 'nosniff');
      expect(mockResponse.headers.set).toHaveBeenCalledWith('Referrer-Policy', 'origin-when-cross-origin');
    });

    it('adds CSP header for non-API routes', () => {
      mockRequest = createMockRequest('/dashboard');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockResponse.headers.set).toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.stringContaining("default-src 'self'")
      );
    });

    it('does not add CSP header for API routes', () => {
      mockRequest = createMockRequest('/api/contact');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockResponse.headers.set).not.toHaveBeenCalledWith(
        'Content-Security-Policy',
        expect.any(String)
      );
    });
  });

  describe('Matcher Configuration', () => {
    it('exports correct matcher configuration', () => {
      // Import the actual module to check the config export
      const { config } = require('../middleware');
      
      expect(config.matcher).toEqual([
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
        '/dashboard(.*)',
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('handles routes with query parameters', () => {
      mockRequest = createMockRequest('/dashboard?tab=settings');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('handles routes with hash fragments', () => {
      mockRequest = createMockRequest('/dashboard#section');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('handles deeply nested protected routes', () => {
      mockRequest = createMockRequest('/dashboard/projects/123/settings/advanced');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });

    it('handles API routes with multiple segments', () => {
      mockRequest = createMockRequest('/api/dashboard/projects/123/stats');
      
      const handler = (clerkMiddleware as jest.Mock).mock.calls[0][0];
      handler(mockAuth, mockRequest);

      expect(mockAuth.protect).toHaveBeenCalled();
    });
  });
});