# Dark Mode Testing Documentation

## Overview

This document describes the comprehensive test suite for the dark mode feature implementation in the Phoenix Precision Agency website.

## Test Structure

### Unit Tests

#### Component Tests
- **ThemeProvider** (`/components/providers/__tests__/theme-provider.test.tsx`)
  - Tests the theme context provider wrapper
  - Verifies prop passing and children rendering
  
- **ThemeToggle** (`/components/__tests__/theme-toggle.test.tsx`)
  - Tests basic theme switching functionality
  - Verifies dropdown menu behavior
  - Tests keyboard navigation and accessibility
  
- **ThemeToggleWithPersistence** (`/components/__tests__/theme-toggle-with-persistence.test.tsx`)
  - Tests API persistence functionality
  - Verifies error handling for network failures
  - Tests preference synchronization

### Integration Tests

#### API Tests
- **User Preferences API** (`/app/api/user/preferences/__tests__/route.test.ts`)
  - Tests GET endpoint for retrieving theme preferences
  - Tests PATCH endpoint for updating preferences
  - Verifies authentication handling (optional)
  - Tests Redis integration and error scenarios

#### Theme Integration Tests
- **Theme System Integration** (`/lib/__tests__/theme-integration.test.tsx`)
  - Tests theme provider integration with components
  - Verifies system theme detection
  - Tests localStorage persistence
  - Verifies API synchronization
  - Tests edge cases and error handling

#### UI Component Tests
- **Component Theme Rendering** (`/lib/__tests__/theme-ui-components.test.tsx`)
  - Tests UI components in both light and dark modes
  - Verifies proper styling application
  - Tests accessibility in different themes
  - Verifies transition behavior

## Running Tests

### Local Development

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test theme-toggle.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="theme"
```

### CI/CD Pipeline

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` branch

The CI pipeline runs:
1. Unit and integration tests
2. TypeScript type checking
3. Build verification
4. Coverage reporting

### Coverage Requirements

The test suite enforces the following coverage thresholds:

- **Global**: 70% (branches, functions, lines, statements)
- **Theme Components** (`/components/theme-*.tsx`): 80%
- **Preferences API** (`/app/api/user/preferences/route.ts`): 85%

## Test Utilities

### Theme Test Utils (`/lib/__tests__/theme-test-utils.tsx`)

Provides helper functions for testing theme-related functionality:

- `renderWithTheme()` - Render components with theme provider
- `mockTheme()` - Mock the useTheme hook
- `mockMatchMedia()` - Mock system color scheme preference
- `mockLocalStorage()` - Mock localStorage for theme persistence
- `mockClerkUser()` - Mock authenticated user for API tests

### Example Usage

```typescript
import { renderWithTheme, mockTheme } from '@/lib/__tests__/theme-test-utils';

it('changes theme when button is clicked', async () => {
  const { mockSetTheme } = mockTheme();
  
  render(<ThemeToggle />);
  
  const button = screen.getByRole('button');
  await userEvent.click(button);
  
  const darkOption = screen.getByRole('menuitem', { name: /dark/i });
  await userEvent.click(darkOption);
  
  expect(mockSetTheme).toHaveBeenCalledWith('dark');
});
```

## Key Test Scenarios

### 1. Theme Detection
- System preference detection (light/dark)
- Manual theme selection override
- Default theme application

### 2. Theme Persistence
- localStorage saving/reading
- API synchronization
- Offline functionality

### 3. UI Consistency
- Component rendering in both themes
- Style application verification
- Transition smoothness

### 4. Error Handling
- Network failures
- Invalid theme values
- Missing authentication

### 5. Accessibility
- Keyboard navigation
- Screen reader support
- Contrast ratios

## Debugging Tests

### Common Issues

1. **Hydration Mismatches**
   - Ensure `suppressHydrationWarning` is set on theme-dependent elements
   - Use `disableTransitionOnChange` in tests

2. **Mock Conflicts**
   - Clear mocks between tests with `jest.clearAllMocks()`
   - Reset document classes: `document.documentElement.classList.remove('dark', 'light')`

3. **Async Operations**
   - Use `waitFor` for API calls and state updates
   - Mock fetch responses appropriately

### Debug Commands

```bash
# Run single test with verbose output
pnpm test --verbose theme-toggle.test.tsx

# Debug specific test
node --inspect-brk node_modules/.bin/jest --runInBand theme-toggle.test.tsx

# Generate detailed coverage report
pnpm test:coverage --coverageReporters=html
# Open coverage/index.html in browser
```

## Adding New Tests

When adding theme-related features:

1. Create unit tests for new components
2. Add integration tests for API endpoints
3. Update UI component tests for theme rendering
4. Ensure coverage thresholds are met
5. Update this documentation

## Environment Variables for Testing

Tests use mock values by default. For integration testing with real services:

```bash
# .env.test
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
RESEND_API_KEY=re_test_...
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies (API, localStorage)
3. **Cleanup**: Always clean up after tests
4. **Descriptive**: Use clear test descriptions
5. **Coverage**: Aim for high coverage but focus on critical paths
6. **Performance**: Keep tests fast, mock heavy operations