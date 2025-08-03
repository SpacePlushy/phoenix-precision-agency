# Phoenix Precision Agency - Comprehensive Project Context

## Project Overview

### Mission Statement
Phoenix Precision Agency specializes in transforming outdated websites into modern, high-performing digital experiences. The positioning is "NASA engineer brings aerospace precision to business websites" - targeting Phoenix small businesses needing web transformation.

### Key Business Information
- **Contact Email**: fmp321@gmail.com
- **Phone**: (602) 531-4111
- **GitHub Repository**: https://github.com/SpacePlushy/phoenix-precision-agency
- **Live URL**: Auto-deployed via Vercel GitHub integration

### Project Goals
1. Create a compelling agency website showcasing web transformation capabilities
2. Demonstrate the contrast between outdated and modern web design
3. Drive conversions through trust-building and clear value proposition
4. Optimize for performance, SEO, and user experience

## Technology Stack

### Core Framework
- **Next.js 15.4.5** with App Router
- **React 19.1.0** 
- **TypeScript 5.x** with strict mode enabled
- **Node.js 18+** runtime

### Styling & UI
- **Tailwind CSS v4** (latest version with new features)
- **shadcn/ui** components (Button, Card, Badge, Skeleton)
- **Framer Motion 12.23.12** for animations
- **Custom color scheme**:
  - Primary: Navy (#0F172A)
  - Accent: Blue (#3B82F6)
  - Success: Green (#10B981)
  - Background: Light (#F8FAFC)

### Data & External Services
- **Upstash Redis** (optional) - Lead storage, rate limiting, analytics
- **Resend** (optional) - Email notifications
- **Clerk** (optional) - Dashboard authentication
- **react-hook-form 7.62.0** - Form handling

### Testing Infrastructure
- **Jest 30.0.5** with TypeScript support
- **React Testing Library 16.3.0**
- **Coverage tracking** enabled
- **Custom test environment** configurations

## Architecture Decisions

### File Structure
```
/app                    # Next.js App Router
  /(marketing)         # Public pages with shared layout
    /page.tsx         # Homepage
    /contact          # Contact page
    /portfolio        # Portfolio page
  /(dashboard)        # Protected admin area
    /dashboard        # Analytics dashboard
  /api               # API routes
    /contact         # Contact form submission
/components          # Reusable React components
  /demo             # Demo comparison components
  /forms            # Form components
  /ui               # Base UI components
/lib                # Utility functions and services
  /analytics.ts     # Analytics tracking
  /upstash.ts      # Redis integration
  /types.ts        # TypeScript definitions
```

### Key Architectural Patterns

1. **Environment Variable Strategy**
   - All external services are optional
   - Graceful fallback when services unavailable
   - Environment detection for proper configuration

2. **Performance Optimization**
   - Lazy loading for demo components
   - Chrome-specific animation workarounds
   - Performance monitoring and reporting
   - Skeleton loading states

3. **Error Handling**
   - Comprehensive error boundaries
   - Service-specific error catching
   - User-friendly error messages
   - Logging for debugging

4. **Testing Strategy**
   - Unit tests for utilities and components
   - Integration tests for API routes
   - Acceptance tests for critical user flows
   - Mocking external dependencies

## Current Implementation Status

### Completed Features ✅
1. **Homepage with Hero Section**
   - NASA engineer positioning
   - Clear value proposition
   - Call-to-action buttons

2. **Interactive Demo Section**
   - Side-by-side comparison (2005 vs Modern)
   - Browser chrome UI
   - Smooth animations with performance fixes
   - Auto-play functionality
   - Mobile-responsive design

3. **Contact Form**
   - Form validation
   - Rate limiting (5 submissions per IP per hour)
   - Redis storage for leads
   - Email notifications via Resend
   - Success/error feedback

4. **Trust Building Elements**
   - NASA engineer badge
   - Years of experience counter
   - Uptime guarantee badge
   - Performance metrics with animations

5. **SEO & Performance**
   - Meta tags optimization
   - Structured data
   - Performance monitoring
   - Loading states

### Known Issues & Technical Debt

1. **Test Suite Issues (30/52 tests failing)**
   - Framer Motion mocking problems
   - Text content mismatches
   - Redis connection errors in tests
   - Type safety issues in analytics
   - Animation state test failures

2. **Performance Considerations**
   - Chrome animation performance addressed with workarounds
   - Demo section uses lazy loading
   - Further optimization opportunities identified

3. **Type Safety**
   - Some analytics functions need stricter typing
   - Test mock types could be improved

## Code Patterns & Conventions

### Component Structure
```typescript
// Standard component pattern
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState();
  
  // Effects next
  useEffect(() => {}, []);
  
  // Handlers
  const handleAction = () => {};
  
  // Render
  return <div>...</div>;
}
```

### Error Handling Pattern
```typescript
try {
  // Operation
  await riskyOperation();
} catch (error) {
  console.error('Context-specific error:', error);
  // Graceful fallback
  return defaultValue;
}
```

### Testing Patterns
- Mock external dependencies
- Test user interactions over implementation
- Use data-testid for reliable element selection
- Group related tests in describe blocks

## Agent Coordination History

### Recent Agent Sessions

1. **Test Fixing Session (Most Recent)**
   - Fixed 22 out of 52 failing tests
   - Identified Framer Motion mocking as major issue
   - Updated test expectations to match implementations
   - Left Redis-dependent tests for later resolution

2. **Performance Optimization**
   - Added skeleton components
   - Enhanced performance monitoring
   - Fixed Chrome-specific animation issues
   - Implemented lazy loading for demo

3. **UI Enhancement Session**
   - Added professional browser chrome to demo
   - Enhanced visual polish
   - Fixed Tailwind CSS v4 class issues
   - Improved responsive design

### Agent Best Practices Discovered
- Always check for environment variables before using services
- Test both success and failure paths
- Consider mobile experience in all features
- Maintain graceful degradation
- Document decisions in CLAUDE.md

## Future Roadmap

### Immediate Priorities
1. Fix remaining 30 test failures
2. Implement analytics dashboard
3. Add portfolio/case studies page
4. Enhance mobile experience

### Feature Enhancements
1. A/B testing for demo versions
2. Advanced analytics visualization
3. CMS integration for portfolio
4. Client testimonials section
5. Blog/resources section

### Technical Improvements
1. Implement proper Framer Motion test mocks
2. Add E2E testing with Playwright
3. Optimize bundle size
4. Implement proper caching strategy
5. Add monitoring and alerting

## Deployment & Operations

### Deployment Process
1. Push to main branch: `git push origin main`
2. Vercel automatically deploys via GitHub integration
3. No manual deployment commands needed
4. User verifies deployment and reports back

### Monitoring
- Performance metrics tracked in-app
- Analytics stored in Redis (when available)
- Error logging to console
- Future: Add proper monitoring service

## Environment Configuration

### Required Variables (All Optional)
```env
UPSTASH_REDIS_REST_URL=     # Redis connection
UPSTASH_REDIS_REST_TOKEN=   # Redis auth
RESEND_API_KEY=             # Email service
CLERK_SECRET_KEY=           # Auth service
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= # Clerk public
CONTACT_EMAIL_TO=           # Email recipient
```

### Service Fallbacks
- No Redis: Forms work but no persistence
- No Resend: No email notifications
- No Clerk: Dashboard inaccessible
- All features degrade gracefully

## Testing Status Summary

### Current Test Results
- **Total Test Suites**: 16
- **Passing**: 11 suites, 163 tests
- **Failing**: 5 suites, 31 tests
- **Main Issues**:
  - Framer Motion animation mocking
  - Redis connection in test environment
  - Text content synchronization
  - Type assertions in analytics

### Test Categories
1. **Unit Tests**: Components, utilities
2. **Integration Tests**: API routes, services
3. **Acceptance Tests**: User flows
4. **Missing**: E2E tests

## Key Decisions Log

1. **Tailwind CSS v4**: Adopted latest version despite being new
2. **Optional Services**: All external services optional for easier development
3. **Animation Strategy**: Chrome-specific workarounds for performance
4. **Testing Approach**: Focus on user behavior over implementation
5. **Error Handling**: Always fail gracefully with user-friendly messages

---

This context should be used to maintain continuity across agent sessions and ensure consistent development practices.