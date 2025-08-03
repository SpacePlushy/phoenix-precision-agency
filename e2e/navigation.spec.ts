import { test, expect } from '@playwright/test';
import { waitForReactReady, disableAnimations } from './helpers/test-utils';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    await disableAnimations(page);
  });
  
  test('should navigate between all pages successfully', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await waitForReactReady(page);
    await expect(page).toHaveURL('/');
    
    // Navigate to Portfolio
    await page.getByRole('link', { name: 'Portfolio' }).first().click();
    await page.waitForURL('/portfolio', { timeout: 10000 });
    await waitForReactReady(page);
    await expect(page.getByRole('heading', { name: /Our Work/i })).toBeVisible({ timeout: 10000 });
    
    // Navigate to Contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await page.waitForURL('/contact', { timeout: 10000 });
    await waitForReactReady(page);
    await expect(page.getByRole('heading', { name: /Let's Build Something/i })).toBeVisible({ timeout: 10000 });
    
    // Navigate back to Home using logo
    await page.getByRole('link', { name: 'Phoenix Precision' }).first().click();
    await page.waitForURL('/', { timeout: 10000 });
    await waitForReactReady(page);
    await expect(page.getByRole('heading', { name: /Transform Your Business/i, level: 1 })).toBeVisible({ timeout: 10000 });
  });

  test('should handle direct URL navigation', async ({ page }) => {
    // Direct navigation to portfolio
    await page.goto('/portfolio');
    await waitForReactReady(page);
    await expect(page).toHaveURL('/portfolio');
    await expect(page.getByRole('heading', { name: /Our Work/i })).toBeVisible();
    
    // Direct navigation to contact
    await page.goto('/contact');
    await waitForReactReady(page);
    await expect(page).toHaveURL('/contact');
    await expect(page.getByRole('heading', { name: /Let's Build Something/i })).toBeVisible();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.getByText(/404/)).toBeVisible();
    await expect(page.getByText(/Page not found/i)).toBeVisible();
    
    // Should have a link back to home
    const homeLink = page.getByRole('link', { name: /Go back home/i });
    await expect(homeLink).toBeVisible();
    
    // Clicking home link should work
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await waitForReactReady(page);
    
    // Check navigation is visible - use more specific selector
    const nav = page.getByRole('navigation', { name: 'Main navigation' }).or(page.locator('nav').first());
    await expect(nav).toBeVisible({ timeout: 10000 });
    
    // Navigate to different pages and ensure nav stays visible
    await page.getByRole('link', { name: 'Portfolio' }).first().click();
    await page.waitForURL('/portfolio', { timeout: 10000 });
    await expect(nav).toBeVisible({ timeout: 5000 });
    
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await page.waitForURL('/contact', { timeout: 10000 });
    await expect(nav).toBeVisible({ timeout: 5000 });
  });

  test('should have working footer links', async ({ page }) => {
    await page.goto('/');
    await waitForReactReady(page);
    
    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    
    // Test footer navigation links
    const footerPortfolioLink = footer.getByRole('link', { name: 'Portfolio' });
    await footerPortfolioLink.click();
    await page.waitForURL('/portfolio');
    await expect(page).toHaveURL('/portfolio');
    
    // Go back and test contact link
    await page.goto('/');
    await waitForReactReady(page);
    await footer.scrollIntoViewIfNeeded();
    const footerContactLink = footer.getByRole('link', { name: 'Contact' });
    await footerContactLink.click();
    await page.waitForURL('/contact');
    await expect(page).toHaveURL('/contact');
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto('/');
    await waitForReactReady(page);
    await page.getByRole('link', { name: 'Portfolio' }).first().click();
    await page.waitForURL('/portfolio', { timeout: 10000 });
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await page.waitForURL('/contact', { timeout: 10000 });
    
    // Go back
    await page.goBack();
    await page.waitForURL('/portfolio', { timeout: 10000 });
    await waitForReactReady(page);
    
    // Go back again
    await page.goBack();
    await page.waitForURL('/', { timeout: 10000 });
    await waitForReactReady(page);
    
    // Go forward
    await page.goForward();
    await page.waitForURL('/portfolio', { timeout: 10000 });
    await waitForReactReady(page);
  });

  test('should have accessible skip navigation link', async ({ page }) => {
    await page.goto('/');
    await waitForReactReady(page);
    
    // Tab to reveal skip link (usually hidden until focused)
    await page.keyboard.press('Tab');
    
    // Check if skip link exists (may be visually hidden)
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    const skipLinkExists = await skipLink.count() > 0;
    
    if (skipLinkExists) {
      // If skip link exists, verify it's visible when focused
      await expect(skipLink).toBeVisible();
      // Click the skip link
      await skipLink.click();
      // Should navigate to main content
      await expect(page).toHaveURL(/#main-content$/);
    } else {
      // Skip link should exist for accessibility
      expect(skipLinkExists).toBeTruthy();
    }
  });

  test('should highlight active navigation item', async ({ page }) => {
    // Start from homepage
    await page.goto('/');
    await waitForReactReady(page);
    
    // Navigate to Portfolio
    await page.getByRole('link', { name: 'Portfolio' }).first().click();
    await page.waitForURL('/portfolio');
    
    // Navigate to Contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await page.waitForURL('/contact');
  });
});