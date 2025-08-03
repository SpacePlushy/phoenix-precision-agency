import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }: any) => (
    <div data-testid="theme-provider" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
    themes: ['light', 'dark', 'system'],
    systemTheme: 'light',
    resolvedTheme: 'light',
  })),
}));

// Custom render function that includes providers
export function renderWithTheme(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

// Helper to mock theme hook with custom values
export function mockTheme(overrides: Partial<{
  theme: string;
  setTheme: jest.Mock;
  themes: string[];
  systemTheme: string;
  resolvedTheme: string;
}> = {}) {
  const { useTheme } = require('next-themes');
  const mockSetTheme = jest.fn();
  
  useTheme.mockReturnValue({
    theme: 'light',
    setTheme: mockSetTheme,
    themes: ['light', 'dark', 'system'],
    systemTheme: 'light',
    resolvedTheme: 'light',
    ...overrides,
  });

  return { mockSetTheme };
}

// Helper to test theme transitions
export async function testThemeTransition(
  element: HTMLElement,
  expectedClass: string
) {
  // Check if element has the expected class
  expect(element).toHaveClass(expectedClass);
}

// Mock matchMedia for different color schemes
export function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? matches : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Helper to test localStorage interactions
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  const localStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return { localStorageMock, store };
}

// Helper to wait for theme changes
export async function waitForThemeChange() {
  return new Promise(resolve => setTimeout(resolve, 100));
}

// Mock user for Clerk authentication
export function mockClerkUser(user: any = null) {
  jest.mock('@clerk/nextjs/server', () => ({
    currentUser: jest.fn().mockResolvedValue(user),
  }));
}

// Test data factories
export function createMockUser(overrides = {}) {
  return {
    id: 'user_123',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    ...overrides,
  };
}

export function createMockPreferences(overrides = {}) {
  return {
    theme: 'system',
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}