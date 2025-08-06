// Mock implementation of NextRequest and NextResponse for testing

export class NextRequest {
  public url: string;
  public headers: Headers;
  public method: string;
  public body: any;
  
  constructor(url: string | URL, init: RequestInit = {}) {
    this.url = typeof url === 'string' ? url : url.toString();
    this.headers = new Headers();
    
    if (init.headers) {
      const headers = init.headers as Record<string, string>;
      Object.entries(headers).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
    
    this.method = init.method || 'GET';
    this.body = init.body;
  }
  
  get nextUrl() {
    return new URL(this.url);
  }
}

// Mock Headers implementation
class Headers {
  private headers: Map<string, string>;
  
  constructor() {
    this.headers = new Map();
  }
  
  get(name: string): string | null {
    return this.headers.get(name.toLowerCase()) || null;
  }
  
  set(name: string, value: string): void {
    this.headers.set(name.toLowerCase(), value);
  }
  
  has(name: string): boolean {
    return this.headers.has(name.toLowerCase());
  }
  
  delete(name: string): void {
    this.headers.delete(name.toLowerCase());
  }
  
  forEach(callback: (value: string, key: string) => void): void {
    this.headers.forEach(callback);
  }
}

export class NextResponse extends Response {
  static json(body: any, init?: ResponseInit) {
    return new NextResponse(JSON.stringify(body), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
  
  static redirect(url: string | URL, status = 302) {
    return new NextResponse(null, {
      status,
      headers: {
        Location: typeof url === 'string' ? url : url.toString(),
      },
    });
  }
  
  static next(init?: ResponseInit) {
    return new NextResponse(null, init);
  }
}

// Mock cookies implementation
export const cookies = () => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  has: jest.fn(),
  getAll: jest.fn(() => []),
});

// Mock headers implementation
export const headers = () => ({
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  has: jest.fn(),
  entries: jest.fn(() => []),
  forEach: jest.fn(),
});