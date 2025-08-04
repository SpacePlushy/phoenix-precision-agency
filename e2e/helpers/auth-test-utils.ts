import { Page } from '@playwright/test';

/**
 * Authentication test utilities for E2E tests
 */

export interface MockUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

/**
 * Mock authentication state in the browser
 * This simulates Clerk's authentication without actual sign-in
 */
export async function mockAuthState(page: Page, user: MockUser | null) {
  await page.addInitScript((mockUser) => {
    // Mock Clerk's window.__clerk object
    (window as any).__clerk = {
      user: mockUser ? {
        id: mockUser.id,
        primaryEmailAddress: {
          emailAddress: mockUser.email,
        },
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        username: mockUser.username,
      } : null,
      session: mockUser ? {
        id: 'mock-session-id',
        status: 'active',
      } : null,
    };

    // Mock localStorage entries that Clerk uses
    if (mockUser) {
      window.localStorage.setItem('__clerk_session', JSON.stringify({
        id: 'mock-session-id',
        userId: mockUser.id,
      }));
    } else {
      window.localStorage.removeItem('__clerk_session');
    }
  }, user);
}

/**
 * Clear all authentication state
 */
export async function clearAuthState(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    delete (window as any).__clerk;
  });
}

/**
 * Wait for Clerk to load on the page
 */
export async function waitForClerkLoad(page: Page) {
  await page.waitForFunction(() => {
    return typeof (window as any).Clerk !== 'undefined';
  }, { timeout: 10000 });
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const clerk = (window as any).__clerk;
    return clerk?.session?.status === 'active';
  });
}

/**
 * Get current user data
 */
export async function getCurrentUser(page: Page): Promise<MockUser | null> {
  return await page.evaluate(() => {
    const clerk = (window as any).__clerk;
    if (!clerk?.user) return null;
    
    return {
      id: clerk.user.id,
      email: clerk.user.primaryEmailAddress?.emailAddress,
      firstName: clerk.user.firstName,
      lastName: clerk.user.lastName,
      username: clerk.user.username,
    };
  });
}

/**
 * Navigate and wait for auth redirect
 */
export async function navigateWithAuthCheck(page: Page, url: string, expectedUrl?: string) {
  await page.goto(url);
  
  if (expectedUrl) {
    await page.waitForURL(expectedUrl, { timeout: 5000 });
  }
  
  // Wait for any auth redirects to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Test data for mock users
 */
export const testUsers = {
  regular: {
    id: 'user_123',
    email: 'test@phoenixprecision.com',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
  },
  admin: {
    id: 'admin_456',
    email: 'admin@phoenixprecision.com',
    firstName: 'Admin',
    lastName: 'User',
    username: 'adminuser',
  },
  noName: {
    id: 'user_789',
    email: 'noname@phoenixprecision.com',
  },
};

/**
 * Helper to test protected routes
 */
export async function testProtectedRoute(page: Page, route: string) {
  // Clear auth state
  await clearAuthState(page);
  
  // Try to access protected route
  await page.goto(route);
  
  // Should redirect to sign-in
  await page.waitForURL(/sign-in/, { timeout: 5000 });
  
  return page.url();
}

/**
 * Helper to test public routes
 */
export async function testPublicRoute(page: Page, route: string) {
  // Clear auth state
  await clearAuthState(page);
  
  // Access public route
  await page.goto(route);
  
  // Should stay on the route
  await page.waitForURL(route, { timeout: 5000 });
  
  return page.url();
}

/**
 * Helper to check navigation auth state
 */
export async function checkNavigationAuthState(page: Page, isSignedIn: boolean) {
  if (isSignedIn) {
    // Should show user menu
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 5000 });
    
    // Should not show sign in/get started
    const signInButton = page.getByRole('link', { name: 'Sign In' });
    await signInButton.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
  } else {
    // Should show sign in/get started buttons
    await page.waitForSelector('text=Sign In', { timeout: 5000 });
    await page.waitForSelector('text=Get Started', { timeout: 5000 });
    
    // Should not show user menu
    const userMenu = page.locator('[data-testid="user-menu"]');
    await userMenu.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
  }
}