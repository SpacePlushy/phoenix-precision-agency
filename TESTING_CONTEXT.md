# Phoenix Precision Agency - Testing Context

## E2E Test Status (2025-08-03)

### Test Results: 189/280 Failing

#### Critical Failures by Category

**1. Duplicate Elements (Strict Mode Violations)**
- Multiple elements with text "Get Started" causing ambiguity
- Duplicate "Contact" links in navigation
- Multiple "Learn More" buttons without unique identifiers

**2. Missing Content Sections**
- "Lightning-Fast Performance" section not found
- Missing testimonials on some pages
- Portfolio case studies incomplete

**3. Mobile Issues**
- Touch targets < 48x48px (accessibility failure)
- Viewport issues on Pixel 5 and iPhone 12
- Navigation menu overlap on small screens

**4. Form Validation**
- Rate limiting not properly tested
- Error message display issues
- Success state transitions failing

### Test Configuration

**Browsers Tested:**
- ✅ Chromium (Desktop)
- ❌ Firefox (Disabled - config issues)
- ✅ WebKit (Safari)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

**GitHub Actions Workflow:**
- Runs on push to main/develop
- Parallel execution for efficiency
- Artifacts saved for 30 days
- Separate mobile test job

### Test File Structure
```
/e2e/
├── global-setup.ts         # Test environment setup
├── homepage.spec.ts        # Homepage tests
├── contact.spec.ts         # Contact form tests
├── portfolio.spec.ts       # Portfolio page tests
├── navigation.spec.ts      # Navigation tests
├── performance.spec.ts     # Performance metrics
├── mobile.spec.ts         # Mobile-specific tests
└── accessibility.spec.ts   # A11y compliance
```

### Common Test Patterns

**Element Selection:**
```typescript
// Use data-testid when possible
await page.getByTestId('contact-form')

// Use accessible roles
await page.getByRole('button', { name: 'Submit' })

// Avoid text-based selectors for duplicates
// BAD: await page.getByText('Get Started')
// GOOD: await page.getByRole('link', { name: 'Get Started' }).first()
```

**Mobile Testing:**
```typescript
// Check viewport
await expect(page.viewportSize()).toEqual({ width: 393, height: 851 })

// Test touch interactions
await page.tap('#mobile-menu-button')

// Verify touch target sizes
const box = await button.boundingBox()
expect(box.width).toBeGreaterThanOrEqual(48)
expect(box.height).toBeGreaterThanOrEqual(48)
```

### Fixing Test Failures

**Priority Order:**
1. Fix duplicate elements (add unique test-ids)
2. Add missing content sections
3. Fix mobile touch targets
4. Update test selectors
5. Re-run full test suite

**Quick Fixes:**
```typescript
// Add test IDs to components
<button data-testid="hero-cta-button">Get Started</button>

// Increase touch target sizes
className="min-h-[48px] min-w-[48px] p-3"

// Add aria-labels for clarity
aria-label="Navigate to contact page"
```

### Running Tests Locally

```bash
# Run all tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e homepage.spec.ts

# Run with UI mode (debugging)
pnpm test:e2e:ui

# Run headed (see browser)
pnpm test:e2e:headed

# Run only mobile tests
pnpm test:e2e --project="Mobile Chrome"
```

### Test Environment Variables
```bash
# Required for CI
CI=true

# Optional for local testing
PLAYWRIGHT_HEADED=1
PLAYWRIGHT_SLOW_MO=500
```

### Recent Test Updates
1. Added GitHub Actions workflow
2. Configured multi-browser testing
3. Set up mobile device emulation
4. Added screenshot/video on failure
5. Implemented parallel execution

### Next Testing Steps
1. Add unique test IDs to all interactive elements
2. Create visual regression tests
3. Add performance benchmarks
4. Implement API mocking for consistent tests
5. Add dark mode specific tests

---
**Remember:** Always run tests locally before pushing to avoid CI failures!