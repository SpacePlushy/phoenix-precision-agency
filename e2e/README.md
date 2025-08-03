# E2E Tests

This directory contains end-to-end tests for the Phoenix Precision Agency website using Playwright.

## Test Structure

- `homepage.spec.ts` - Tests for homepage elements, animations, and content
- `demo.spec.ts` - Tests for the interactive demo (2005 vs modern comparison)
- `contact-form.spec.ts` - Tests for contact form validation and submission
- `navigation.spec.ts` - Tests for navigation and routing
- `responsive.spec.ts` - Tests for responsive design across different devices
- `helpers/test-utils.ts` - Utility functions for common test operations

## Running Tests

```bash
# Install browsers (first time only)
pnpm playwright:install

# Run all tests
pnpm test:e2e

# Run tests in headed mode (see browser)
pnpm test:e2e:headed

# Run tests in UI mode (interactive)
pnpm test:e2e:ui

# Run tests in debug mode
pnpm test:e2e:debug

# Run specific test file
pnpm test:e2e homepage.spec.ts

# Run tests on specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

## Test Coverage

### Homepage Tests
- ✅ Hero section with all key elements
- ✅ Performance metrics animations
- ✅ Navigation functionality
- ✅ Footer information
- ✅ Theme handling (no hydration issues)

### Demo Tests
- ✅ Auto-switch functionality (3-second timer)
- ✅ Manual toggle between views
- ✅ Progress bar animation
- ✅ Content display for each view
- ✅ Mobile single-view display
- ✅ CTA section visibility

### Contact Form Tests
- ✅ Form field display
- ✅ Required field validation
- ✅ Email format validation
- ✅ Successful submission flow
- ✅ Rate limiting handling
- ✅ Server error handling
- ✅ Form data preservation on errors
- ✅ Keyboard navigation (focus management)

### Navigation Tests
- ✅ Page-to-page navigation
- ✅ Direct URL navigation
- ✅ 404 page handling
- ✅ Navigation state persistence
- ✅ Footer link functionality
- ✅ Browser back/forward navigation
- ✅ Active navigation highlighting

### Responsive Tests
- ✅ Mobile navigation menu
- ✅ Content stacking on mobile
- ✅ Touch target sizes
- ✅ Tablet layouts
- ✅ Desktop multi-column layouts
- ✅ Orientation changes
- ✅ Responsive images
- ✅ Text overflow handling

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

The CI pipeline runs tests on:
- Multiple browsers (Chromium, Firefox, WebKit)
- Mobile devices (Mobile Chrome, Mobile Safari)

## Best Practices

1. **Wait for Hydration**: Use `waitForHydration()` helper after navigation
2. **Handle Animations**: Use `waitForAnimations()` for Framer Motion animations
3. **Mock External APIs**: Use `mockAPIResponse()` for consistent test results
4. **Check Accessibility**: Run `checkAccessibility()` on new features
5. **Use Semantic Selectors**: Prefer role-based and text-based selectors

## Debugging Failed Tests

1. **Run in headed mode**: `pnpm test:e2e:headed`
2. **Use UI mode**: `pnpm test:e2e:ui`
3. **Check screenshots**: Failed tests save screenshots in `test-results/`
4. **View traces**: Traces are saved on first retry
5. **Debug mode**: `pnpm test:e2e:debug` for step-by-step execution

## Environment Variables

Tests use the following environment variables:
- `CI` - Set to `true` in CI environment
- `BASE_URL` - Override the base URL (default: http://localhost:3000)

## Common Issues

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running properly
- Use `waitForHydration()` helper

### Flaky tests
- Add explicit waits for animations
- Use `waitForLoadState('networkidle')`
- Mock external API calls

### Element not found
- Check for correct selectors
- Ensure element is visible (not behind modal/overlay)
- Wait for dynamic content to load