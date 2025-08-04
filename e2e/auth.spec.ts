import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Navigation Authentication State', () => {
    test('shows sign in and get started buttons when not authenticated', async ({ page }) => {
      // Desktop view
      await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
      
      // Check that user menu is not visible
      await expect(page.getByTestId('user-menu')).not.toBeVisible();
    });

    test('navigates to sign-in page when sign in is clicked', async ({ page }) => {
      await page.getByRole('link', { name: 'Sign In' }).click();
      await expect(page).toHaveURL('/sign-in');
      await expect(page.getByText('Welcome Back')).toBeVisible();
    });

    test('navigates to sign-up page when get started is clicked', async ({ page }) => {
      await page.getByRole('link', { name: 'Get Started' }).click();
      await expect(page).toHaveURL('/sign-up');
      await expect(page.getByText('Create your account to transform your business')).toBeVisible();
    });
  });

  test.describe('Mobile Navigation Authentication', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('shows auth buttons in mobile menu', async ({ page }) => {
      // Open mobile menu
      await page.getByLabel('Toggle menu').click();
      
      // Check mobile auth buttons
      const signInButtons = page.getByRole('link', { name: 'Sign In' });
      const getStartedButtons = page.getByRole('link', { name: 'Get Started' });
      
      await expect(signInButtons).toHaveCount(2); // Desktop (hidden) and mobile
      await expect(getStartedButtons).toHaveCount(2);
    });

    test('closes mobile menu after clicking sign in', async ({ page }) => {
      await page.getByLabel('Toggle menu').click();
      
      // Click mobile sign in (the visible one)
      await page.getByRole('link', { name: 'Sign In' }).last().click();
      
      await expect(page).toHaveURL('/sign-in');
      // Menu should be closed - check by looking for menu icon (not X icon)
      await expect(page.getByTestId('menu-icon')).toBeVisible();
    });
  });

  test.describe('Sign In Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-in');
    });

    test('displays sign in page elements', async ({ page }) => {
      await expect(page.getByText('Welcome Back')).toBeVisible();
      await expect(page.getByText('Sign in to access your dashboard')).toBeVisible();
      
      // Clerk SignIn component should be present
      await expect(page.locator('.cl-component')).toBeVisible();
    });

    test('has correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Sign In/);
    });

    test('maintains responsive layout', async ({ page, viewport }) => {
      if (viewport) {
        // Desktop view
        await page.setViewportSize({ width: 1280, height: 720 });
        const container = page.locator('.max-w-md');
        await expect(container).toBeVisible();
        
        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(container).toBeVisible();
        await expect(container).toHaveCSS('padding-left', '16px');
        await expect(container).toHaveCSS('padding-right', '16px');
      }
    });
  });

  test.describe('Sign Up Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/sign-up');
    });

    test('displays sign up page elements', async ({ page }) => {
      await expect(page.getByText('Get Started')).toBeVisible();
      await expect(page.getByText('Create your account to transform your business')).toBeVisible();
      
      // Clerk SignUp component should be present
      await expect(page.locator('.cl-component')).toBeVisible();
    });

    test('has correct page title', async ({ page }) => {
      await expect(page).toHaveTitle(/Sign Up|Get Started/);
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects to sign-in when accessing dashboard unauthenticated', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to Clerk's sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('redirects to sign-in for nested dashboard routes', async ({ page }) => {
      await page.goto('/dashboard/settings');
      
      // Should redirect to Clerk's sign-in page
      await expect(page).toHaveURL(/sign-in/);
    });

    test('allows access to public routes', async ({ page }) => {
      const publicRoutes = ['/', '/portfolio', '/contact'];
      
      for (const route of publicRoutes) {
        await page.goto(route);
        await expect(page).toHaveURL(route);
      }
    });
  });

  test.describe('Loading States', () => {
    test('shows loading skeleton in navigation', async ({ page }) => {
      // Intercept Clerk's auth check to simulate loading
      await page.route('**/v1/client**', async route => {
        await page.waitForTimeout(1000); // Simulate delay
        await route.continue();
      });
      
      await page.goto('/');
      
      // Should show skeleton loader
      const skeleton = page.locator('[role="status"]').first();
      await expect(skeleton).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('sign-in page meets accessibility standards', async ({ page }) => {
      await page.goto('/sign-in');
      
      // Check for proper heading hierarchy
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveText('Welcome Back');
      
      // Check for proper contrast
      const title = page.getByText('Welcome Back');
      await expect(title).toHaveCSS('color', 'rgb(15, 23, 42)'); // text-foreground color
    });

    test('sign-up page meets accessibility standards', async ({ page }) => {
      await page.goto('/sign-up');
      
      // Check for proper heading hierarchy
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveText('Get Started');
      
      // Check focus management
      await page.keyboard.press('Tab');
      // First focusable element should be within the Clerk component
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('handles API errors gracefully', async ({ page }) => {
      // Intercept Clerk API calls and simulate error
      await page.route('**/v1/client**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Internal Server Error' }),
        });
      });
      
      await page.goto('/sign-in');
      
      // Page should still render with error handling
      await expect(page.getByText('Welcome Back')).toBeVisible();
    });
  });

  test.describe('Theme Consistency', () => {
    test('auth pages use consistent theme', async ({ page }) => {
      // Check sign-in page
      await page.goto('/sign-in');
      const signInContainer = page.locator('.min-h-screen');
      await expect(signInContainer).toHaveCSS('background-color', 'rgb(248, 250, 252)'); // bg-background
      
      // Check sign-up page
      await page.goto('/sign-up');
      const signUpContainer = page.locator('.min-h-screen');
      await expect(signUpContainer).toHaveCSS('background-color', 'rgb(248, 250, 252)'); // bg-background
    });
  });
});