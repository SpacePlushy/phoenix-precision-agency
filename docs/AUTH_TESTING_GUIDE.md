# Authentication Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the authentication features in Phoenix Precision Agency, including unit tests, integration tests, and E2E tests.

## Test Structure

### Unit Tests

Located in component-specific `__tests__` directories:

- `/components/__tests__/Navigation.test.tsx` - Navigation component auth states
- `/components/__tests__/UserMenu.test.tsx` - User menu component
- `/app/sign-in/[[...sign-in]]/__tests__/page.test.tsx` - Sign-in page
- `/app/sign-up/[[...sign-up]]/__tests__/page.test.tsx` - Sign-up page
- `/__tests__/middleware.test.ts` - Middleware and protected routes

### E2E Tests

Located in `/e2e/`:

- `auth.spec.ts` - Basic authentication flow tests
- `auth-user-journey.spec.ts` - Complete user journey tests

### Test Utilities

Located in `/e2e/helpers/`:

- `auth-test-utils.ts` - Authentication testing utilities and mock helpers

## Running Tests

### All Authentication Tests
```bash
# Run all auth-related unit tests
pnpm test -- --testPathPattern="(Navigation|UserMenu|sign-in|sign-up|middleware)"

# Run auth E2E tests
pnpm test:e2e -- auth

# Run with coverage
pnpm test -- --testPathPattern="auth" --coverage
```

### Specific Test Suites
```bash
# Navigation tests only
pnpm test Navigation.test.tsx

# User menu tests only
pnpm test UserMenu.test.tsx

# Sign-in/Sign-up page tests
pnpm test -- --testPathPattern="sign-(in|up)"

# Middleware tests
pnpm test middleware.test.ts
```

### Mobile Tests
```bash
# Run E2E tests on mobile viewports
pnpm test:e2e -- auth --project="Mobile Chrome" --project="Mobile Safari"
```

## Test Coverage Areas

### 1. Navigation Component (`Navigation.test.tsx`)

**Authentication States:**
- ✅ Shows sign-in/get-started buttons when not authenticated
- ✅ Shows user menu when authenticated
- ✅ Shows loading skeleton during auth check
- ✅ Handles auth state transitions

**Mobile Responsiveness:**
- ✅ Mobile menu functionality
- ✅ Auth buttons in mobile menu
- ✅ Menu closes after navigation

**Accessibility:**
- ✅ Skip navigation link
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Focus management

### 2. UserMenu Component (`UserMenu.test.tsx`)

**Loading States:**
- ✅ Shows skeleton when loading
- ✅ Handles rapid state changes

**User Data Display:**
- ✅ Shows user name (firstName, username, or "User")
- ✅ Shows user email
- ✅ Handles missing data gracefully

**Clerk Integration:**
- ✅ UserButton configuration
- ✅ Dashboard link
- ✅ Sign-out functionality

### 3. Sign-In/Sign-Up Pages

**Page Structure:**
- ✅ Correct headings and copy
- ✅ Clerk component integration
- ✅ Responsive layout

**Theming:**
- ✅ Consistent appearance configuration
- ✅ CSS variable usage
- ✅ Dark mode support

### 4. Middleware (`middleware.test.ts`)

**Route Protection:**
- ✅ Protects /dashboard routes
- ✅ Protects /api/dashboard routes
- ✅ Allows public routes

**Security Headers:**
- ✅ X-Frame-Options
- ✅ X-Content-Type-Options
- ✅ CSP for non-API routes

### 5. E2E Tests (`auth.spec.ts`, `auth-user-journey.spec.ts`)

**User Flows:**
- ✅ Navigation to auth pages
- ✅ Protected route redirects
- ✅ Mobile authentication
- ✅ Browser navigation (back/forward)

**Error Handling:**
- ✅ Network errors
- ✅ API failures
- ✅ Loading states

## Mocking Strategies

### Clerk Authentication Mock

```typescript
// Mock @clerk/nextjs hooks
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(() => ({
    isLoaded: true,
    isSignedIn: false,
  })),
  useUser: jest.fn(() => ({
    isLoaded: true,
    user: null,
  })),
}));
```

### E2E Authentication Mock

```typescript
// Use auth-test-utils.ts helpers
import { mockAuthState, testUsers } from './helpers/auth-test-utils';

// Mock authenticated state
await mockAuthState(page, testUsers.regular);

// Clear auth state
await clearAuthState(page);
```

## CI/CD Integration

The `.github/workflows/auth-tests.yml` workflow runs:

1. **Unit Tests** - Fast, isolated component tests
2. **Integration Tests** - Tests with mocked external services
3. **E2E Tests** - Full browser tests on multiple viewports
4. **Mobile Tests** - Specific mobile viewport tests

### Required Secrets

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names
- Test both happy paths and edge cases

### 2. Mocking
- Mock external dependencies (Clerk, Next.js router)
- Use consistent mock data across tests
- Clear mocks between tests

### 3. Assertions
- Test user-visible behavior, not implementation
- Verify accessibility attributes
- Check responsive behavior

### 4. Performance
- Run unit tests in parallel
- Use `beforeEach` for common setup
- Minimize E2E test redundancy

## Debugging Tests

### Unit Tests
```bash
# Run in watch mode
pnpm test -- --watch

# Debug specific test
pnpm test -- --testNamePattern="shows sign in button"
```

### E2E Tests
```bash
# Run in headed mode
pnpm test:e2e -- --headed

# Debug mode
pnpm test:e2e -- --debug

# Keep browser open on failure
pnpm test:e2e -- --headed --workers=1
```

## Common Issues

### 1. Clerk Mock Not Working
- Ensure mock is defined before component import
- Check that all required Clerk methods are mocked

### 2. E2E Test Timeouts
- Increase timeout in test or globally
- Check for proper wait conditions
- Verify selectors are correct

### 3. Mobile Test Failures
- Ensure viewport is set before navigation
- Check for mobile-specific selectors
- Verify responsive CSS classes

## Future Improvements

1. **Test Data Management**
   - Centralized test user fixtures
   - Database seeding for E2E tests

2. **Visual Regression Testing**
   - Screenshot comparisons for auth pages
   - Theme consistency checks

3. **Performance Testing**
   - Auth flow timing metrics
   - Loading state duration checks

4. **Security Testing**
   - CSRF protection verification
   - XSS prevention tests