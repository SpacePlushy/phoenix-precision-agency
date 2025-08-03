import { test, expect, devices, Page } from '@playwright/test';
import { waitForReactReady, disableAnimations } from './helpers/test-utils';

// Helper to check mobile navigation
async function checkMobileNavigation(page: Page) {
  // Mobile menu button should be visible (using aria-label)
  const menuButton = page.getByRole('button', { name: 'Toggle menu' });
  await expect(menuButton).toBeVisible();
  
  // Desktop navigation links should be hidden
  const desktopNav = page.locator('.hidden.md\\:flex').locator('a[href="/portfolio"]').first();
  await expect(desktopNav).not.toBeVisible();
  
  // Click menu button
  await menuButton.click();
  
  // Wait for menu animation
  await page.waitForTimeout(100);
  
  // Mobile menu should open with navigation links
  const mobileNav = page.getByRole('navigation');
  await expect(mobileNav.getByRole('link', { name: 'Portfolio' })).toBeVisible();
  await expect(mobileNav.getByRole('link', { name: 'Contact' })).toBeVisible();
}

// Helper to check desktop navigation
async function checkDesktopNavigation(page: Page) {
  // Desktop navigation should be visible - use first() to handle multiple matches
  const nav = page.getByRole('navigation');
  await expect(nav.getByRole('link', { name: 'Portfolio' }).first()).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Contact' }).first()).toBeVisible();
  
  // Mobile menu button should not be visible
  const menuButton = page.getByRole('button', { name: /menu/i });
  const menuButtonCount = await menuButton.count();
  if (menuButtonCount > 0) {
    await expect(menuButton).toHaveCSS('display', 'none');
  }
}

test.describe('Responsive Design', () => {
  test('should show mobile navigation menu on mobile devices', async ({ browser }) => {
    // Create mobile context
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    await checkMobileNavigation(page);
    
    await context.close();
  });

  test('should stack content vertically on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Check that grid layouts become single column
    const heroButtons = page.locator('.flex-col.sm\\:flex-row').first();
    const computedStyle = await heroButtons.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(computedStyle).toBe('column');
    
    await context.close();
  });

  test('should show single demo view on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Scroll to demo section
    const demoSection = page.locator('section').filter({ hasText: 'Interactive Demo' });
    await demoSection.scrollIntoViewIfNeeded();
    
    // Mobile should show single view container
    const mobileContainer = page.locator('.lg\\:hidden').first();
    await expect(mobileContainer).toBeVisible();
    
    // Desktop side-by-side view should be hidden
    const desktopContainer = page.locator('.hidden.lg\\:grid');
    await expect(desktopContainer).toHaveCSS('display', 'none');
    
    await context.close();
  });

  test('should have appropriate touch targets on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Check button sizes for touch targets (minimum 44x44px)
    const buttons = page.getByRole('button').locator('visible=true');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        const text = await button.textContent() || '';
        const classes = await button.getAttribute('class') || '';
        
        // Only check buttons that should have touch targets
        if (!classes.includes('w-3') && !classes.includes('h-3') && !classes.includes('size-3') && text.trim() !== '') {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
    
    await context.close();
  });

  test('should show appropriate layout for tablets', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Check that content uses medium breakpoint styles
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
    
    // Typography should use tablet-appropriate sizes
    const heading = page.getByRole('heading', { level: 1 });
    const fontSize = await heading.evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    // Should be between mobile and desktop sizes
    expect(parseInt(fontSize)).toBeGreaterThan(24);
    expect(parseInt(fontSize)).toBeLessThan(72);
    
    await context.close();
  });

  test('should show desktop navigation on desktop', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    await checkDesktopNavigation(page);
    
    await context.close();
  });

  test('should show side-by-side demo views on desktop', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Scroll to demo section
    const demoSection = page.locator('section').filter({ hasText: 'Interactive Demo' });
    await demoSection.scrollIntoViewIfNeeded();
    
    // Desktop container should be visible
    const desktopContainer = page.locator('.hidden.lg\\:grid');
    await expect(desktopContainer).toBeVisible();
    
    // Should have two columns
    const columns = desktopContainer.locator('> div');
    await expect(columns).toHaveCount(2);
    
    await context.close();
  });

  test('should have multi-column layouts on desktop', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Find grid sections
    const gridSections = page.locator('.grid.grid-cols-1.md\\:grid-cols-3');
    const firstGrid = gridSections.first();
    
    if (await firstGrid.count() > 0 && await firstGrid.isVisible()) {
      // Check that grid has multiple columns
      const gridStyle = await firstGrid.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      // Should have 3 columns on desktop
      const columns = gridStyle.split(' ').filter(col => col !== 'repeat(3,' && col !== '1fr)');
      expect(columns.length).toBeGreaterThanOrEqual(3);
    }
    
    await context.close();
  });

  test('should handle orientation changes', async ({ browser }) => {
    // Create a context with specific viewport
    const context = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      isMobile: true,
      reducedMotion: 'reduce'
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Portrait orientation
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Switch to landscape
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(100); // Wait for viewport change
    
    // Content should still be visible and properly laid out
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    await context.close();
  });

  test('should have responsive images', async ({ page }) => {
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Check for responsive image attributes
    const images = page.locator('img').locator('visible=true');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      const firstImage = images.first();
      // Images should at least have a src attribute
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
      
      // Check that images have proper dimensions or loading attributes
      const width = await firstImage.getAttribute('width');
      const height = await firstImage.getAttribute('height');
      const loading = await firstImage.getAttribute('loading');
      
      // At least one of these should be present for proper image handling
      expect(width || height || loading).toBeTruthy();
    }
  });

  test('should handle text overflow appropriately', async ({ page, viewport }) => {
    if (!viewport) return;
    
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
    
    // Check that long text doesn't cause horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Allow small margin for scrollbar
    
    // Verify that the page handles text properly by checking for no horizontal overflow
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    // Page should not have horizontal scroll
    expect(hasHorizontalScroll).toBeFalsy();
  });
});