import { Page, expect } from '@playwright/test';

/**
 * Helper function to wait for animations to complete
 */
export async function waitForAnimations(page: Page, timeout = 300) {
  // Use CSS transitions/animations disable via reducedMotion in config
  // Just wait a short time for any remaining JS animations
  await page.waitForTimeout(timeout);
  
  // Also wait for any pending requestAnimationFrame callbacks
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

/**
 * Helper to check if element is in viewport
 */
export async function isInViewport(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Helper to wait for React hydration
 */
export async function waitForHydration(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve());
      }
    });
  });
  // Additional wait for React hydration
  await page.waitForTimeout(100);
}

/**
 * Helper to fill form with validation
 */
export async function fillFormField(
  page: Page,
  label: string,
  value: string,
  options?: { exact?: boolean }
) {
  const field = page.getByLabel(label, options);
  await field.click();
  await field.fill(value);
  // Trigger validation
  await field.blur();
}

/**
 * Helper to check for console errors
 */
export function setupConsoleErrorListener(page: Page): string[] {
  const consoleErrors: string[] = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      // Ignore some common non-critical errors
      const ignoredErrors = [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Clerk:'
      ];
      
      const errorText = msg.text();
      const shouldIgnore = ignoredErrors.some(ignored => 
        errorText.includes(ignored)
      );
      
      if (!shouldIgnore) {
        consoleErrors.push(errorText);
      }
    }
  });
  
  return consoleErrors;
}

/**
 * Helper to test responsive breakpoints
 */
export const breakpoints = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 720 },
  wide: { width: 1920, height: 1080 }
};

/**
 * Helper to mock API responses
 */
export async function mockAPIResponse(
  page: Page,
  url: string,
  response: any,
  status = 200
) {
  await page.route(url, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response)
    });
  });
}

/**
 * Helper to check accessibility
 */
export async function checkAccessibility(page: Page, selector?: string) {
  const target = selector ? page.locator(selector) : page;
  
  // Check for alt text on images
  const images = await target.locator('img').all();
  for (const img of images) {
    const alt = await img.getAttribute('alt');
    expect(alt).toBeTruthy();
  }
  
  // Check for form labels
  const inputs = await target.locator('input:not([type="hidden"])').all();
  for (const input of inputs) {
    const id = await input.getAttribute('id');
    if (id) {
      const label = await page.locator(`label[for="${id}"]`).count();
      expect(label).toBeGreaterThan(0);
    }
  }
  
  // Check for heading hierarchy
  const headings = await target.locator('h1, h2, h3, h4, h5, h6').all();
  let lastLevel = 0;
  for (const heading of headings) {
    const tagName = await heading.evaluate(el => el.tagName);
    const level = parseInt(tagName.substring(1));
    expect(level - lastLevel).toBeLessThanOrEqual(1);
    lastLevel = level;
  }
}

/**
 * Helper to mock successful contact form submission
 */
export async function mockContactFormSuccess(page: Page) {
  await page.route('/api/contact', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
        id: 'test_lead_123'
      }),
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '2',
        'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString(),
      }
    });
  });
}

/**
 * Helper to mock rate limited response
 */
export async function mockContactFormRateLimit(page: Page) {
  await page.route('/api/contact', async (route) => {
    await route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Too many requests. Please try again later.'
      }),
      headers: {
        'X-RateLimit-Limit': '3',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + 3600000).toISOString(),
      }
    });
  });
}

/**
 * Helper to wait for React to be ready
 */
export async function waitForReactReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Wait for React to be ready
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).React) {
        // React is already loaded
        resolve();
      } else {
        // Wait a bit more for hydration
        setTimeout(resolve, 200);
      }
    });
  });
}

/**
 * Helper to disable animations via CSS
 */
export async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: 0s !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0s !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
      }
    `
  });
}