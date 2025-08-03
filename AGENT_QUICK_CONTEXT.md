# Phoenix Precision Agency - Quick Agent Context

## Current State Summary (2025-08-03)

### What's Working
- **Core Site**: Homepage, contact form, portfolio page all functional
- **Dark Mode**: Fully implemented with system preference detection
- **Contact System**: Redis-backed with rate limiting and email notifications
- **Demo**: Interactive 2005 vs modern site comparison with auto-switching
- **Deployment**: Auto-deploy via GitHub → Vercel integration

### Immediate Issues
1. **E2E Tests**: 189/280 failing (duplicate elements, missing content sections)
2. **Mobile**: Touch targets too small (< 48x48px)
3. **Content**: "Lightning-Fast Performance" section missing
4. **Firefox**: Browser tests disabled due to config issues

### Active Work
- Fixing duplicate elements in strict mode
- Adding missing content sections
- Resolving mobile viewport issues

### Key Files to Know
```
/app/(marketing)/        # Public pages
/components/             # UI components
/e2e/                   # Test suites
PROJECT_CONTEXT.md      # Full documentation
CLAUDE.md              # AI instructions
```

### Quick Commands
```bash
pnpm dev               # Start dev server
pnpm test:e2e         # Run E2E tests
git push              # Deploy to production
```

### Environment Variables
- `UPSTASH_REDIS_*` - Redis for leads/rate limiting
- `RESEND_API_KEY` - Email notifications
- `CLERK_*` - Admin authentication

### Recent Changes
1. Dark mode implementation (next-themes)
2. GitHub Actions E2E workflow
3. Contact form updates
4. Demo view auto-switching fix

### Next Steps
1. Fix failing E2E tests (priority)
2. Add missing content sections
3. Verify mobile responsiveness
4. Test dark mode across all components

### Contact Info
- Production Email: fmp321@gmail.com
- Phone: (602) 531-4111
- GitHub: https://github.com/SpacePlushy/phoenix-precision-agency

---
**Quick Tips:**
- Always run `pnpm dev` before making changes
- Check PROJECT_CONTEXT.md for detailed info
- Use git push to deploy (no manual Vercel commands)
- User will report deployment results