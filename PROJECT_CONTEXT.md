# Phoenix Precision Agency - Comprehensive Project Context

## 1. Project Overview

### Project Goals and Objectives
- **Primary Goal**: Create a modern, high-converting agency website for Phoenix small businesses
- **Value Proposition**: "NASA engineer brings aerospace precision to business websites"
- **Target Market**: Small businesses in Phoenix area needing website modernization
- **Core Message**: Transform outdated 2005-era websites into modern, performance-driven solutions

### Key Architectural Decisions
- **Framework**: Next.js 15.4.5 with App Router (chosen for performance and SEO)
- **Styling**: Tailwind CSS v4 with custom design system
- **Type Safety**: Full TypeScript implementation for reliability (strict mode)
- **Route Groups**: Using `(marketing)` and `(dashboard)` for logical separation
- **Performance First**: Focus on Core Web Vitals and loading speed
- **Edge Runtime**: Middleware optimized for Edge Runtime compatibility

### Technology Stack
**Core Dependencies:**
- Next.js 15.4.5 (React 19.1.0)
- TypeScript 5.x (strict mode)
- Tailwind CSS v4
- Framer Motion 12.23.12 (animations)

**UI Components:**
- shadcn/ui components (Button, Card, Badge, Skeleton)
- Custom components built on Radix UI primitives
- Lucide React for icons

**Backend Services (Optional):**
- Upstash Redis (lead storage, rate limiting, analytics)
- Resend (email notifications)
- Clerk (admin authentication - preserved in feature/clerk-auth-preserve branch)
- Vercel Analytics (integrated)

**Testing:**
- Jest for unit tests
- Playwright for E2E tests (multi-browser support)
- Testing Library for component tests

### Team Conventions and Patterns
- **File Structure**: Feature-based organization with clear separation of concerns
- **Component Pattern**: Functional components with TypeScript interfaces
- **Styling**: Utility-first with Tailwind, custom CSS variables for theming
- **State Management**: React hooks and context for local state
- **Error Handling**: Centralized error boundaries and graceful fallbacks
- **Performance**: Lazy loading, code splitting, optimized images, pipeline batching

## 2. Current State

### Git and Deployment Status
- **Current Branch**: feature/clean-improvements
- **PR Status**: PR #5 created for merging to main
- **Deployment**: Preview deployment active on Vercel from PR #5
- **Auto-Deploy**: GitHub integration with Vercel for automatic deployments

### Recently Implemented Features
1. **Security Enhancements**
   - Content Security Policy (CSP) with pragmatic approach
   - HTTP Strict Transport Security (HSTS) - 1 year, includeSubDomains
   - X-Frame-Options, X-Content-Type-Options protection
   - Rate limiting with anti-spoofing measures
   - Secure middleware refactored for Edge Runtime

2. **Performance Optimizations**
   - Redis pipeline batching for bulk operations
   - Fixed N+1 query patterns
   - Edge Runtime compatibility in middleware
   - Optimized database queries
   - Bundle size analysis completed

3. **Interactive Demo Section**
   - Split-screen comparison (2005 vs modern site)
   - Auto-switching views with smooth zoom transitions
   - Progress indicators and animations
   - Responsive design with mobile optimizations

4. **Contact System**
   - Form with validation (react-hook-form)
   - Rate limiting via Upstash Redis with anti-spoofing
   - Email notifications through Resend
   - Lead storage in Redis with pipeline batching
   - Success/error handling with user feedback

5. **Trust Building Elements**
   - NASA engineer badge with experience
   - Client testimonials section
   - 99.9% uptime guarantee
   - Performance metrics with animations
   - Portfolio showcase

6. **Error Pages**
   - Theme-aware error pages (dark/light mode support)
   - Custom 404 and error pages
   - User-friendly error messages

### Build and Test Status
- **Build**: ✅ Successful
- **Unit Tests**: 11/16 passing (5 failures due to mocks)
- **E2E Tests**: 19 tests failing (mock-related issues)
- **Deployment**: Ready for production via PR #5

### Known Issues and Technical Debt
1. **Test Infrastructure**
   - 19 tests failing due to mock issues
   - Mock implementations need updating
   - Test data needs standardization

2. **Bundle Size**
   - Homepage bundle larger than target 150KB
   - Needs code splitting and dynamic imports
   - Priority: Medium (not blocking deployment)

3. **CSP Limitations**
   - Next.js requires unsafe-inline for styles
   - Using pragmatic CSP policy as workaround
   - Future: Implement nonce-based CSP when better supported

### Performance Baselines
- **Lighthouse Scores** (target):
  - Performance: 95+
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- **Core Web Vitals**:
  - LCP: < 2.5s
  - FID: < 100ms
  - CLS: < 0.1
- **Bundle Size Target**: < 150KB for homepage

## 3. Design Decisions

### Architectural Choices and Rationale
1. **App Router over Pages Router**
   - Better performance with React Server Components
   - Improved data fetching patterns
   - Built-in layouts and error handling

2. **Route Groups Strategy**
   - `(marketing)`: Public-facing pages with shared layout
   - `(dashboard)`: Admin area with authentication (Clerk-ready)
   - Clear separation of concerns

3. **Component Architecture**
   - Atomic design principles
   - Reusable UI components via shadcn
   - Clear props interfaces with TypeScript
   - Server components by default, client components only when needed

4. **Edge Runtime Strategy**
   - Middleware refactored for Edge Runtime compatibility
   - Removed Node.js specific dependencies
   - Optimized for performance at edge locations

### API Design Patterns
1. **Server Actions** for form submissions
2. **API Routes** for external integrations
3. **Edge Functions** for performance-critical paths
4. **Rate Limiting** at API level with anti-spoofing

### Database Schema Decisions
**Redis Data Structure (with Pipeline Batching):**
```
leads:{email} - Contact form submissions
analytics:{metric}:{date} - Performance metrics
ratelimit:{ip} - Rate limiting counters with anti-spoofing
```

### Security Implementations
1. **Input Validation** - Zod schemas for all user inputs
2. **Rate Limiting** - IP-based with Upstash, anti-spoofing measures
3. **CSRF Protection** - Built into Next.js
4. **Content Security Policy** - Pragmatic CSP headers (unsafe-inline for Next.js)
5. **HTTP Strict Transport Security** - 1 year max-age with includeSubDomains
6. **X-Frame-Options** - DENY to prevent clickjacking
7. **X-Content-Type-Options** - nosniff
8. **Authentication** - Clerk preserved in separate branch for future use

### File Structure
```
/app                    # Next.js App Router
  /(marketing)         # Public pages with shared layout
    /page.tsx         # Homepage
    /contact          # Contact page
    /portfolio        # Portfolio page
  /(dashboard)        # Protected admin area (Clerk-ready)
    /dashboard        # Analytics dashboard
  /api               # API routes
    /contact         # Contact form submission with rate limiting
/components          # Reusable React components
  /demo             # Demo comparison components
  /forms            # Form components
  /ui               # Base UI components (shadcn)
  /Analytics.tsx    # Vercel Analytics wrapper
/lib                # Utility functions and services
  /security/        # Security modules
    /csp.ts        # Content Security Policy
    /headers.ts    # Security headers configuration
    /rateLimit.ts  # Rate limiting with anti-spoofing
  /analytics.ts     # Analytics tracking
  /upstash.ts      # Redis integration with pipeline batching
  /types.ts        # TypeScript definitions
/middleware.ts      # Edge Runtime security middleware
```

## 4. Code Patterns

### Coding Conventions Used
```typescript
// Component Structure
interface ComponentProps {
  // Props with JSDoc comments
}

export function Component({ prop }: ComponentProps) {
  // Hook usage at top
  // Event handlers
  // Render logic
}

// Consistent naming
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case or PascalCase for components
```

### Common Patterns and Abstractions
1. **Loading States**: Skeleton components for better UX
2. **Error Boundaries**: Graceful error handling
3. **Lazy Loading**: Dynamic imports for heavy components
4. **Animation Patterns**: Framer Motion with consistent easing

### Testing Strategies
1. **Unit Tests**: Critical business logic
2. **Integration Tests**: API routes and forms
3. **E2E Tests**: User journeys across browsers
4. **Visual Regression**: Screenshot comparisons

### Error Handling Approaches
1. **Try-Catch Blocks**: Async operations
2. **Error Boundaries**: Component-level failures
3. **Fallback UI**: Loading and error states
4. **User Feedback**: Toast notifications

## 5. Agent Coordination History

### Recent Agent Coordination (feature/clean-improvements)
1. **security-auditor**: Identified and fixed critical security vulnerabilities
   - Implemented CSP, HSTS, security headers
   - Fixed rate limiting with anti-spoofing
   - Created security modules in lib/security/

2. **debugger**: Fixed build errors and test failures
   - Resolved middleware Edge Runtime compatibility
   - Fixed TypeScript errors
   - Addressed test suite issues

3. **database-optimizer**: Optimized Redis operations
   - Implemented pipeline batching
   - Fixed N+1 query patterns
   - Optimized lead storage

4. **code-reviewer**: Comprehensive code quality review
   - Identified code smells and improvements
   - Suggested architectural enhancements
   - Reviewed security implementations

5. **architect-reviewer**: Evaluated architectural patterns
   - Validated design decisions
   - Suggested repository pattern for future
   - Reviewed separation of concerns

6. **performance-engineer**: Analyzed and optimized performance
   - Bundle size analysis
   - Performance metrics evaluation
   - Suggested optimization strategies

7. **test-automator**: Assessed test coverage
   - Identified test gaps
   - Suggested test improvements
   - Reviewed E2E test structure

### Successful Agent Combinations
1. **Security + Debugger**: Fixed security issues while maintaining functionality
2. **Database + Performance**: Optimized data access patterns
3. **Code Review + Architecture**: Comprehensive quality assessment
4. **Context Management**: Preserved knowledge across all agents

### Agent-Specific Findings
- **Security**: Critical vulnerabilities fixed, pragmatic CSP implemented
- **Performance**: Bundle size needs optimization, pipeline batching successful
- **Database**: Redis operations optimized, N+1 patterns eliminated
- **Testing**: 19 tests still failing, needs mock updates
- **Architecture**: Good separation of concerns, repository pattern suggested

### Cross-Agent Dependencies
1. Security implementations → All components
2. Database optimizations → API routes
3. Performance improvements → Frontend and backend
4. Test suite → All features
5. Context management → Future agent coordination

## 6. Future Roadmap

### Immediate Tasks (PR #5 Ready)
1. ✅ Merge PR #5 to main for production deployment
2. Fix remaining 19 test failures (mock-related issues)
3. Optimize bundle size to <150KB for homepage
4. Add comprehensive error boundaries

### Planned Features
1. **Analytics Dashboard**
   - Real-time visitor tracking (Vercel Analytics integrated)
   - Conversion metrics
   - Performance monitoring

2. **Enhanced Portfolio**
   - Case studies with metrics
   - Before/after comparisons
   - Client testimonials

3. **Blog/Resources**
   - SEO-focused content
   - Technical guides
   - Industry insights

4. **Client Portal** (when Clerk auth enabled)
   - Project status tracking
   - Document sharing
   - Communication hub

### Medium-term Improvements
1. **Security Enhancements**
   - Implement nonce-based CSP when Next.js support improves
   - Enhanced monitoring and alerting
   - Security audit automation

2. **Performance Optimizations**
   - Reduce bundle size below 150KB
   - Implement service worker
   - Add resource hints
   - Code splitting strategy

3. **Architecture Evolution**
   - Implement repository pattern
   - Add domain layer
   - Enhance error boundaries
   - Improve test coverage to >80%

### Technical Debt to Address
1. **Test Suite**
   - Fix 19 failing tests (mock issues)
   - Add visual regression tests
   - Performance benchmarks
   - Increase coverage

2. **Bundle Optimization**
   - Tree shaking improvements
   - Dynamic imports strategy
   - Dependency analysis
   - Target <150KB for homepage

3. **Documentation**
   - API documentation
   - Component storybook
   - Deployment guides
   - Architecture diagrams

### Long-term Vision
1. **Multi-tenant Support**
   - Serve multiple agencies
   - White-label capabilities
   - Custom domains

2. **Advanced Features**
   - CMS integration
   - A/B testing framework
   - Progressive Web App (PWA)
   - AI-powered optimizations

## Deployment & Operations

### Deployment Strategy
- **Platform**: Vercel (auto-deploy from GitHub)
- **Current Status**: PR #5 preview deployment active
- **Branch Strategy**: 
  - `main`: Production (auto-deploys)
  - `feature/clean-improvements`: Current working branch with PR #5
  - `feature/clerk-auth-preserve`: Clerk auth preserved for future

### Monitoring & Analytics
- **Performance**: Vercel Analytics (integrated)
- **Errors**: Built-in Next.js error reporting
- **Security**: CSP, HSTS, rate limiting in place
- **Uptime**: 99.9% guarantee

### Environment Variables (Optional)
```env
# Redis (Upstash) - Optional but recommended
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email (Resend) - Optional
RESEND_API_KEY=

# Authentication (Clerk) - Optional, for future use
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

# Contact Configuration
CONTACT_EMAIL_TO= (default: fmp321@gmail.com)

# Analytics (Vercel) - Automatic in production
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

## Quick Reference

### Key Commands
```bash
# Development
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server

# Testing
pnpm test         # Run unit tests (11/16 passing)
pnpm test:e2e     # E2E tests (19 failing)
pnpm test:watch   # Tests in watch mode

# Type Checking & Linting
pnpm type-check   # TypeScript compiler
pnpm lint         # ESLint

# Deployment
git push          # Auto-deploys via Vercel
```

### Critical Files Modified Recently
- `/middleware.ts` - Edge Runtime security headers
- `/app/api/contact/route.ts` - Secure rate limiting
- `/lib/security/*` - Security modules
- `/lib/upstash.ts` - Pipeline batching
- `/components/Analytics.tsx` - Vercel Analytics
- `PROJECT_CONTEXT.md` - This comprehensive context

### Repository Information
- **GitHub**: https://github.com/SpacePlushy/phoenix-precision-agency
- **Live Site**: Auto-deployed via Vercel
- **PR #5**: Ready for merge to main

### Contact Information
- **Production Email**: contact@phoenixprecision.dev
- **Developer Email**: fmp321@gmail.com
- **Phone**: (602) 531-4111

### Security Status
✅ CSP implemented (pragmatic approach)
✅ HSTS enabled (1 year, includeSubDomains)
✅ Rate limiting with anti-spoofing
✅ Security headers via middleware
✅ Input validation with Zod
✅ Edge Runtime compatible

### Performance Status
✅ Pipeline batching for Redis
✅ N+1 queries fixed
✅ Edge Runtime middleware
⚠️ Bundle size needs optimization (<150KB target)
✅ Lazy loading implemented
✅ Vercel Analytics integrated

---

**Last Updated**: 2025-08-06
**Version**: 2.0.0
**Status**: PR #5 Ready for Production Deployment
**Context Purpose**: Agent Coordination & Project Continuity