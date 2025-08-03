import { test, expect } from '@playwright/test';
import { waitForReactReady, disableAnimations, waitForAnimations } from './helpers/test-utils';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForReactReady(page);
    await disableAnimations(page);
  });

  test('should load with all key elements', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Phoenix Precision Agency/);

    // Check hero section
    await expect(page.getByRole('heading', { name: /Transform Your Business with/i })).toBeVisible();
    await expect(page.getByText('Aerospace Precision', { exact: true })).toBeVisible();
    await expect(page.getByText(/We turn outdated websites into modern digital experiences/i)).toBeVisible();
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Start Your Transformation/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /View Our Work/i })).toBeVisible();

    // Check trust badges - use specific test ids to avoid strict mode errors
    await expect(page.getByTestId('hero-uptime-badge')).toBeVisible();
    await expect(page.getByTestId('hero-security-badge')).toBeVisible();
    await expect(page.getByTestId('hero-support-badge')).toBeVisible();
  });

  test('should display performance metrics with animations', async ({ page }) => {
    // Scroll to performance metrics section
    const metricsSection = page.locator('section').filter({ hasText: 'Lightning-Fast Performance' });
    await metricsSection.scrollIntoViewIfNeeded();

    // Wait for the section to be visible with timeout
    await expect(metricsSection).toBeVisible({ timeout: 10000 });

    // Check for metric labels first
    const metrics = [
      { label: 'Performance Score', value: '100' },
      { label: 'Load Time', value: '0.8s' },
      { label: 'Time to Interactive', value: '1.2s' },
      { label: 'First Contentful Paint', value: '0.5s' }
    ];

    // Check that all metric labels are visible
    for (const metric of metrics) {
      await expect(metricsSection.getByText(metric.label)).toBeVisible({ timeout: 5000 });
    }

    // Wait a bit for any animations to start
    await page.waitForTimeout(1000);

    // Check for values - they appear inside card elements
    for (const metric of metrics) {
      // Find the metric container - look for the metric label and value in proximity
      const metricLabel = metricsSection.getByText(metric.label);
      await expect(metricLabel).toBeVisible({ timeout: 5000 });
      
      // The value should appear near the label with extended timeout for animations
      const metricContainer = metricLabel.locator('..').locator('..');
      await expect(metricContainer.getByText(metric.value)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should have working navigation links', async ({ page }) => {
    // Check navigation is visible
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();

    // Test portfolio link
    await nav.getByRole('link', { name: 'Portfolio' }).click();
    await page.waitForURL('/portfolio');
    await waitForReactReady(page);
    await expect(page.getByRole('heading', { name: /Our Work/i })).toBeVisible();

    // Go back to homepage
    await page.getByRole('link', { name: 'Phoenix Precision' }).click();
    await page.waitForURL('/');
    await waitForReactReady(page);

    // Test contact link
    const navAgain = page.getByRole('navigation', { name: 'Main navigation' });
    await navAgain.getByRole('link', { name: 'Contact' }).click();
    await page.waitForURL('/contact');
    await waitForReactReady(page);
    await expect(page.getByRole('heading', { name: /Let's Build Something/i })).toBeVisible();
  });

  test('should have demo section visible on page', async ({ page }) => {
    // Scroll down to find demo section
    const demoSection = page.locator('section').filter({ hasText: 'Interactive Demo' });
    await demoSection.scrollIntoViewIfNeeded();

    // Check that demo section exists and is visible
    await expect(demoSection).toBeVisible();
    await expect(page.getByText('See the Transformation')).toBeVisible();
  });

  test('should display footer with correct information', async ({ page }) => {
    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();

    // Check footer content
    await expect(footer.getByRole('heading', { name: 'Phoenix Precision Agency' })).toBeVisible();
    await expect(footer.getByText(/NASA engineer bringing aerospace/i)).toBeVisible();
    
    // Check contact info
    await expect(footer.getByText('contact@phoenixprecision.dev')).toBeVisible();
    await expect(footer.getByText('(602) 531-4111')).toBeVisible();
    
    // Check social links
    await expect(footer.getByRole('link', { name: /GitHub/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
  });

  test('should handle theme properly (no hydration issues)', async ({ page }) => {
    // Check that there are no hydration errors in console
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Reload page to check for hydration issues
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check no hydration errors
    const hydrationErrors = consoleErrors.filter(error => 
      error.includes('Hydration') || error.includes('did not match')
    );
    expect(hydrationErrors).toHaveLength(0);
  });
});