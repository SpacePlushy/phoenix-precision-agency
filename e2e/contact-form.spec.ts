import { test, expect } from '@playwright/test';
import { 
  mockContactFormSuccess, 
  mockContactFormRateLimit,
  waitForReactReady,
  disableAnimations
} from './helpers/test-utils';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await waitForReactReady(page);
    await disableAnimations(page);
    await expect(page.getByRole('heading', { name: /Let's Build Something/i })).toBeVisible();
  });

  test('should display all form fields', async ({ page }) => {
    // Check all form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/company/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    
    // Check submit button
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible();
  });

  test('should show validation errors for required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Check validation messages appear - react-hook-form validates on submit
    await expect(page.getByText(/Name is required/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Email is required/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Message is required/i)).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    // Fill in invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Check email validation message
    await expect(page.getByText(/Invalid email address/i)).toBeVisible({ timeout: 10000 });
    
    // Fix email and verify error disappears
    await page.getByLabel(/email/i).clear();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/message/i).fill('Test message');
    
    // Mock successful submission
    await mockContactFormSuccess(page);
    
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Wait for success message instead of checking for absence of error
    await expect(page.getByText(/Thank you/i)).toBeVisible({ timeout: 10000 });
  });

  test('should successfully submit form with valid data', async ({ page }) => {
    // Set up mock for successful submission
    await mockContactFormSuccess(page);
    
    // Fill out the form
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/phone/i).fill('(555) 123-4567');
    await page.getByLabel(/company/i).fill('Acme Corp');
    await page.getByLabel(/message/i).fill('I need a new website for my business.');
    
    // Submit the form
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Wait for success message with longer timeout
    await expect(page.getByText(/Thank you for contacting us/i)).toBeVisible({ timeout: 10000 });
    
    // Form should be reset - wait a bit for the reset to complete
    await page.waitForTimeout(500);
    await expect(page.getByLabel(/name/i)).toHaveValue('');
    await expect(page.getByLabel(/email/i)).toHaveValue('');
    await expect(page.getByLabel(/message/i)).toHaveValue('');
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    // Mock rate limit for this test
    await mockContactFormRateLimit(page);
    
    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Should show rate limit error with longer timeout
    await expect(page.getByText(/Too many requests/i)).toBeVisible({ timeout: 10000 });
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Intercept API calls to simulate server error
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Should show error message with longer timeout - check for any error indication
    const errorMessages = [
      page.getByText(/Something went wrong/i),
      page.getByText(/Internal server error/i),
      page.getByText(/Failed to send/i),
      page.getByText(/Error/i)
    ];
    
    // At least one error message should be visible
    let errorFound = false;
    for (const errorMsg of errorMessages) {
      if (await errorMsg.isVisible().catch(() => false)) {
        errorFound = true;
        break;
      }
    }
    expect(errorFound).toBeTruthy();
  });

  test('should preserve form data on validation error', async ({ page }) => {
    // Fill in partial form data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/phone/i).fill('(555) 123-4567');
    await page.getByLabel(/company/i).fill('Acme Corp');
    
    // Submit without email and message
    await page.getByRole('button', { name: /Send Message/i }).click();
    
    // Check validation errors appear with timeout
    await expect(page.getByText(/Email is required/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Message is required/i)).toBeVisible({ timeout: 5000 });
    
    // Check that filled fields retain their values
    await expect(page.getByLabel(/name/i)).toHaveValue('John Doe');
    await expect(page.getByLabel(/phone/i)).toHaveValue('(555) 123-4567');
    await expect(page.getByLabel(/company/i)).toHaveValue('Acme Corp');
  });

  test('should have proper focus management', async ({ page }) => {
    // Click on the first field to establish focus context
    await page.getByLabel(/name/i).click();
    await expect(page.getByLabel(/name/i)).toBeFocused();
    
    // Tab through form fields
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/phone/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/company/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/message/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeFocused();
  });
});