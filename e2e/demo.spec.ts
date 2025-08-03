import { test, expect } from '@playwright/test';
import { waitForAnimations, waitForReactReady, disableAnimations } from './helpers/test-utils';

test.describe('Interactive Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Scroll to demo section
    const demoSection = page.locator('section').filter({ hasText: 'Interactive Demo' });
    await demoSection.scrollIntoViewIfNeeded();
    await expect(demoSection).toBeVisible();
  });

  test('should auto-switch between old and new views', async ({ page }) => {
    // Initially should show old view
    const oldButton = page.getByRole('button', { name: '2005 Website' });
    const newButton = page.getByRole('button', { name: 'Modern Website' });
    
    // Check initial state - old view should be active
    await expect(oldButton).toHaveAttribute('aria-pressed', 'true');
    
    // Wait for auto-switch to new view - use polling approach
    await expect(async () => {
      const pressed = await newButton.getAttribute('aria-pressed');
      expect(pressed).toBe('true');
    }).toPass({ timeout: 10000, intervals: [500, 1000, 2000] });
    
    // New view should now be active
    await expect(newButton).toHaveAttribute('aria-pressed', 'true');
    await expect(oldButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should manually toggle between views on button click', async ({ page }) => {
    const oldButton = page.getByRole('button', { name: '2005 Website' });
    const newButton = page.getByRole('button', { name: 'Modern Website' });
    
    // Click on Modern Website button
    await newButton.click();
    
    // Check that new view is active with timeout
    await expect(newButton).toHaveAttribute('aria-pressed', 'true', { timeout: 5000 });
    await expect(oldButton).toHaveAttribute('aria-pressed', 'false');
    
    // Click on 2005 Website button
    await oldButton.click();
    
    // Check that old view is active with timeout
    await expect(oldButton).toHaveAttribute('aria-pressed', 'true', { timeout: 5000 });
    await expect(newButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should display correct content for each view', async ({ page }) => {
    // Check old site view content
    const oldSiteBadge = page.locator('text=❌ BEFORE (2005)').first();
    await expect(oldSiteBadge).toBeVisible();
    
    // Old site should have specific characteristics
    const oldSiteContainer = page.locator('.bg-gray-200').first();
    await expect(oldSiteContainer).toBeVisible();
    
    // Switch to new view
    await page.getByRole('button', { name: 'Modern Website' }).click();
    await waitForAnimations(page, 100);
    
    // Check new site view content
    const newSiteBadge = page.locator('text=✅ AFTER (2024)').first();
    await expect(newSiteBadge).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    // Get the progress bar container - use more flexible selector
    const progressBar = page.locator('[role="progressbar"]').or(page.locator('.h-2.bg-muted'));
    await expect(progressBar).toBeVisible({ timeout: 10000 });
    
    // The progress bar should have a gradient fill
    const progressFill = page.locator('.bg-gradient-to-r').first();
    await expect(progressFill).toBeVisible({ timeout: 5000 });
  });

  test('should handle mobile view with single demo display', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    // On mobile, only one view should be shown at a time
    const demoCards = page.locator('article.relative.overflow-hidden');
    const visibleCards = await demoCards.count();
    
    // Mobile should show only one view
    expect(visibleCards).toBeLessThanOrEqual(1);
    
    // Check that view switching still works
    await page.getByRole('button', { name: 'Modern Website' }).click();
    await waitForAnimations(page, 100);
    
    const newSiteBadge = page.locator('text=✅ AFTER (2024)').first();
    await expect(newSiteBadge).toBeVisible();
  });

  test('should display CTA section below demo', async ({ page }) => {
    // Scroll to CTA section
    const ctaSection = page.locator('text=Ready to Leave 2005 Behind?').locator('..');
    await ctaSection.scrollIntoViewIfNeeded();
    
    // Check CTA content
    await expect(ctaSection).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Your Free Transformation Plan' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'See More Transformations' })).toBeVisible();
    
    // Check benefit points
    await expect(page.getByText('Free consultation')).toBeVisible();
    await expect(page.getByText('30-day guarantee')).toBeVisible();
    await expect(page.getByText('NASA-grade precision')).toBeVisible();
  });

  test('should handle mobile view transitions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for viewport change
    
    // Switch views
    await page.getByRole('button', { name: 'Modern Website' }).click();
    
    // Check that the new view is visible with timeout
    const newSiteBadge = page.locator('text=✅ AFTER (2024)').first();
    await expect(newSiteBadge).toBeVisible({ timeout: 10000 });
  });
});