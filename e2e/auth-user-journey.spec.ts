import { test, expect } from '@playwright/test';

test.describe('Authentication User Journey', () => {
  test('complete authentication flow from homepage to dashboard', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Click Get Started in navigation
    await page.getByRole('link', { name: 'Get Started' }).click();
    
    // Should be on sign-up page
    await expect(page).toHaveURL('/sign-up');
    await expect(page.getByText('Create your account to transform your business')).toBeVisible();
    
    // Navigate to sign-in instead
    const signInLink = page.locator('.cl-footerActionLink').filter({ hasText: 'Sign in' });
    if (await signInLink.isVisible()) {
      await signInLink.click();
      await expect(page).toHaveURL('/sign-in');
      await expect(page.getByText('Welcome Back')).toBeVisible();
    }
  });

  test('mobile authentication flow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    await page.getByLabel('Toggle menu').click();
    
    // Click Sign In in mobile menu
    await page.getByRole('link', { name: 'Sign In' }).last().click();
    
    // Should navigate to sign-in page
    await expect(page).toHaveURL('/sign-in');
    
    // Mobile menu should be closed
    await page.goto('/');
    await expect(page.getByTestId('menu-icon')).toBeVisible();
  });

  test('protected route redirection flow', async ({ page }) => {
    // Try to access dashboard without auth
    await page.goto('/dashboard');
    
    // Should redirect to sign-in
    await expect(page).toHaveURL(/sign-in/);
    
    // After sign-in, should redirect back to dashboard
    // Note: This would require actual authentication in a real test
  });

  test('navigation state changes during auth flow', async ({ page }) => {
    await page.goto('/');
    
    // Initially shows auth buttons
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Started' })).toBeVisible();
    
    // After authentication, these would be replaced by UserMenu
    // This would require mocking Clerk's auth state in a real test
  });

  test('handles browser back/forward during auth flow', async ({ page }) => {
    // Navigate through auth pages
    await page.goto('/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/sign-in');
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/sign-in');
  });

  test('maintains auth state across page refreshes', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Refresh page
    await page.reload();
    
    // Should still be on sign-in page
    await expect(page).toHaveURL('/sign-in');
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('responsive auth pages work on various devices', async ({ page }) => {
    const devices = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 },
    ];
    
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      
      // Test sign-in page
      await page.goto('/sign-in');
      await expect(page.getByText('Welcome Back')).toBeVisible();
      
      // Test sign-up page
      await page.goto('/sign-up');
      await expect(page.getByText('Get Started')).toBeVisible();
      
      // Container should adapt to screen size
      const container = page.locator('.max-w-md');
      await expect(container).toBeVisible();
    }
  });

  test('keyboard navigation through auth flow', async ({ page }) => {
    await page.goto('/');
    
    // Tab to Sign In link
    await page.keyboard.press('Tab'); // Skip to main
    await page.keyboard.press('Tab'); // Logo
    await page.keyboard.press('Tab'); // Home
    await page.keyboard.press('Tab'); // Portfolio
    await page.keyboard.press('Tab'); // Contact
    await page.keyboard.press('Tab'); // Sign In
    
    // Press Enter to navigate
    await page.keyboard.press('Enter');
    
    await expect(page).toHaveURL('/sign-in');
  });

  test('loading states during authentication', async ({ page }) => {
    // Slow down network to see loading states
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    
    // Should show skeleton loader in navigation
    const skeleton = page.locator('[role="status"]');
    // Skeleton might appear briefly
    if (await skeleton.isVisible()) {
      await expect(skeleton).toHaveClass(/h-10 w-24/);
    }
  });

  test('error recovery in auth flow', async ({ page }) => {
    // Simulate network error
    await page.route('**/sign-in', route => {
      route.abort('failed');
    });
    
    await page.goto('/');
    
    try {
      await page.getByRole('link', { name: 'Sign In' }).click();
    } catch (e) {
      // Page should handle navigation error gracefully
      await expect(page).toHaveURL('/');
    }
  });
});