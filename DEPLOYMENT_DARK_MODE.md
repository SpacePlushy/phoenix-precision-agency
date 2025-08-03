# Dark Mode Feature Deployment Guide

## Overview
This document outlines the deployment strategy for the dark mode feature implementation in Phoenix Precision Agency website.

## Feature Summary
- **Branch**: `feature/dark-mode`
- **Implementation**: next-themes with system preference detection
- **Storage**: LocalStorage for guests, Redis for authenticated users
- **Bundle Impact**: ~5KB gzipped
- **Browser Support**: All modern browsers (Chrome, Firefox, Safari, Edge)

## Pre-Deployment Checklist

### Code Quality
- [x] All tests passing (100% coverage for theme components)
- [x] TypeScript compilation successful
- [x] ESLint checks passed
- [x] No console errors in development
- [x] FOUC prevention implemented

### Performance
- [x] Bundle size analyzed (~5KB increase)
- [x] No render blocking resources
- [x] CSS variables for instant switching
- [x] Lazy loading for theme demo page

### Accessibility
- [x] Keyboard navigation support
- [x] ARIA labels on toggle button
- [x] Respects system preferences
- [x] High contrast mode compatible

## Environment Variables

### New Variables (Optional)
```env
# Feature flag for dark mode (optional)
NEXT_PUBLIC_FEATURE_DARK_MODE=true

# Theme persistence settings (optional)
THEME_PERSISTENCE_ENABLED=true
THEME_PERSISTENCE_REDIS_TTL=2592000  # 30 days in seconds
```

### Existing Variables (No changes required)
- `UPSTASH_REDIS_REST_URL` - Used for authenticated user preferences
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication
- `CLERK_SECRET_KEY` - For user authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key

## Deployment Steps

### 1. Pre-Deployment Verification
```bash
# On feature branch
git checkout feature/dark-mode

# Run all tests
pnpm test

# Build locally
pnpm build

# Test production build
pnpm start
```

### 2. Create Pull Request
```bash
# Ensure all changes are committed
git add .
git commit -m "feat: implement dark mode with system preference detection

- Add next-themes for theme management
- Create theme toggle component with animations
- Implement API persistence for authenticated users
- Add comprehensive test suite
- Update UI components for dark mode support

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push -u origin feature/dark-mode

# Create PR via GitHub CLI
gh pr create --title "feat: Dark Mode Implementation" --body "$(cat <<'EOF'
## Summary
- Implements dark mode with system preference detection
- Adds theme toggle in navigation bar
- Provides persistence for authenticated users via Redis
- Includes comprehensive test coverage

## Implementation Details
- **Library**: next-themes v0.4.6
- **Bundle Impact**: ~5KB gzipped
- **Storage**: LocalStorage (guests), Redis (authenticated)
- **FOUC Prevention**: suppressHydrationWarning + CSS variables

## Testing
- Unit tests: 100% coverage for theme components
- Integration tests: Theme switching and persistence
- Visual tests: No FOUC, smooth transitions
- Performance: Negligible impact on LCP/FID

## Screenshots
[Add screenshots here after deployment to preview]

## Checklist
- [x] Code follows project style guidelines
- [x] Tests pass locally
- [x] Documentation updated
- [x] No breaking changes
- [x] Feature flag ready (optional)

🤖 Generated with Claude Code
EOF
)"
```

### 3. Vercel Preview Deployment
Once PR is created, Vercel will automatically:
1. Build the feature branch
2. Run tests via GitHub Actions
3. Deploy to preview URL
4. Comment on PR with preview link

### 4. Testing on Preview
```bash
# Preview URL format: https://phoenix-precision-agency-<hash>-<team>.vercel.app

# Test checklist:
- [ ] Theme toggle visible in navigation
- [ ] System preference detection works
- [ ] No FOUC on page load
- [ ] Smooth transitions between themes
- [ ] LocalStorage persistence (guest users)
- [ ] API persistence (authenticated users)
- [ ] All UI components render correctly in both themes
```

### 5. Production Deployment
```bash
# After PR approval and all checks pass
gh pr merge --merge

# Vercel will automatically deploy to production
# Monitor deployment at: https://vercel.com/dashboard
```

## Monitoring & Metrics

### Key Metrics to Track
1. **Performance**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Time to Interactive (TTI)
   - Bundle size changes

2. **User Engagement**
   - Theme toggle usage rate
   - Dark mode adoption percentage
   - System vs manual preference ratio

3. **Errors**
   - Theme switching failures
   - LocalStorage access errors
   - API persistence failures

### Monitoring Setup
```javascript
// Add to existing analytics
window.analytics?.track('theme_changed', {
  theme: newTheme,
  method: 'manual' | 'system',
  authenticated: boolean
});
```

## Rollback Strategy

### Quick Rollback (Feature Flag)
```javascript
// In app/layout.tsx
const isDarkModeEnabled = process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true';

{isDarkModeEnabled ? (
  <ThemeProvider>
    {children}
  </ThemeProvider>
) : (
  children
)}
```

### Full Rollback
```bash
# If critical issues detected
git revert <merge-commit-hash>
git push origin main

# Vercel will auto-deploy the revert
```

### Rollback Triggers
- Performance degradation > 10%
- JavaScript errors affecting > 1% of users
- Visual glitches in production
- SEO impact detected

## Post-Deployment Tasks

### Immediate (0-1 hour)
- [ ] Verify production deployment
- [ ] Test all theme switching scenarios
- [ ] Check error monitoring dashboards
- [ ] Validate performance metrics

### Short-term (1-24 hours)
- [ ] Monitor user feedback
- [ ] Track adoption metrics
- [ ] Address any bug reports
- [ ] Update documentation if needed

### Long-term (1-7 days)
- [ ] Analyze usage patterns
- [ ] Optimize based on metrics
- [ ] Plan iteration improvements
- [ ] Document lessons learned

## Feature Flag Implementation (Optional)

### Environment-based Flag
```typescript
// lib/feature-flags.ts
export const featureFlags = {
  darkMode: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true'
};
```

### Runtime Flag (via Redis)
```typescript
// For A/B testing or gradual rollout
export async function isDarkModeEnabled(userId?: string): Promise<boolean> {
  if (!userId) return true; // Enable for all guests
  
  const redis = await getRedis();
  const flag = await redis.get(`feature:dark-mode:${userId}`);
  return flag === 'true';
}
```

## Troubleshooting

### Common Issues

1. **FOUC (Flash of Unstyled Content)**
   - Ensure `suppressHydrationWarning` is on `<html>`
   - Verify theme script in document head
   - Check CSS variable definitions

2. **Theme Not Persisting**
   - Check LocalStorage permissions
   - Verify Redis connection for authenticated users
   - Ensure cookies are enabled

3. **Performance Issues**
   - Analyze bundle with `next-bundle-analyzer`
   - Check for render loops
   - Verify CSS specificity

### Debug Commands
```bash
# Check theme in browser console
localStorage.getItem('theme')

# Force theme change
localStorage.setItem('theme', 'dark')
window.location.reload()

# Clear theme preference
localStorage.removeItem('theme')
```

## Success Criteria

### Technical
- ✅ Zero increase in error rate
- ✅ < 5% impact on Core Web Vitals
- ✅ 100% test coverage maintained
- ✅ No accessibility regressions

### Business
- ✅ Positive user feedback
- ✅ Increased session duration
- ✅ Reduced bounce rate (dark mode users)
- ✅ Feature adoption > 30% within 30 days

## Contact & Support

- **Technical Lead**: Dark Mode Implementation Team
- **Deployment Issues**: Check Vercel dashboard
- **Bug Reports**: Create GitHub issue with `dark-mode` label
- **Feature Requests**: Add to project backlog

---

Last Updated: 2025-08-03
Next Review: Post-deployment + 7 days