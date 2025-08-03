import { test, expect } from '@playwright/test';

test.describe('Contact Form Simple Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go directly to contact page
    await page.goto('/contact');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Ensure the form is visible
    await expect(page.locator('form')).toBeVisible({ timeout: 15000 });
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    // Click submit button without filling any fields
    const submitButton = page.getByRole('button', { name: /Send Message/i });
    await submitButton.click();
    
    // Wait for validation errors with increased timeout
    await expect(page.getByText('Name is required')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Email is required')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Message is required')).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format correctly', async ({ page }) => {
    // Fill invalid email
    await page.getByLabel(/email/i).fill('not-an-email');
    
    // Click submit to trigger validation
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Should show email validation error
    await expect(page.getByText('Invalid email address')).toBeVisible({ timeout: 15000 });
  });

  test('should submit form successfully with valid data', async ({ page }) => {
    // Mock the API response for success
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your message.',
          id: 'test-123'
        })
      });
    });
    
    // Fill out all required fields
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/message/i).fill('This is a test message for the contact form.');
    
    // Submit the form
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Wait for success message
    await expect(page.getByText(/Thank you for contacting us/i)).toBeVisible({ timeout: 15000 });
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error'
        })
      });
    });
    
    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Should show error message
    await expect(page.getByText(/Something went wrong. Please try again./i)).toBeVisible({ timeout: 15000 });
  });
});