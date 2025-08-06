// Mock Request/Response for Next.js server components
if (typeof global !== 'undefined' && !global.Request) {
  global.Request = class Request {
    constructor(url, init = {}) {
      this.url = url;
      this.headers = new Map();
      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
      this.method = init.method || 'GET';
      this.body = init.body;
    }
    
    get(name) {
      return this.headers.get(name.toLowerCase());
    }
  };
  
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map();
      if (init.headers) {
        Object.entries(init.headers).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }
  };
}

// Only run browser-specific setup in jsdom environment
if (typeof window !== 'undefined') {
  // Learn more: https://github.com/testing-library/jest-dom
  require('@testing-library/jest-dom');

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock CSS custom properties
  document.documentElement.style.setProperty('--color-primary', '#0F172A');
  document.documentElement.style.setProperty('--color-accent', '#3B82F6');
  document.documentElement.style.setProperty('--color-success', '#10B981');
  document.documentElement.style.setProperty('--color-background', '#F8FAFC');
  document.documentElement.style.setProperty('--color-foreground', '#0F172A');
  document.documentElement.style.setProperty('--color-muted', '#64748B');
  document.documentElement.style.setProperty('--color-border', '#E2E8F0');
  document.documentElement.style.setProperty('--color-error', '#EF4444');
  document.documentElement.style.setProperty('--color-warning', '#F59E0B');
}