# Phoenix Precision Agency - Claude Memory

## Deployment Workflow
- **Push to GitHub**: `git push` - this will auto-deploy via Vercel
- **User will report back**: The user will check the live site and report results
- **No need to run vercel commands**: GitHub integration handles deployment

## Project Overview
- **Agency website** for Phoenix small businesses
- **Positioning**: "NASA engineer brings aerospace precision to business websites"
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Upstash Redis, Clerk, Resend

## Key Features Built
- ✅ Interactive demo (2005 vs modern site comparison)
- ✅ Contact form with validation and rate limiting
- ✅ Trust badges (NASA engineer, experience, uptime)
- ✅ Performance metrics with animations
- ✅ Custom color scheme (navy #0F172A, blue #3B82F6)
- ✅ Redis storage for leads and analytics
- ✅ SEO optimization and performance tuning

## Environment Variables (Optional)
- `UPSTASH_REDIS_REST_URL` - For lead storage and rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Redis authentication
- `RESEND_API_KEY` - For email notifications
- `CLERK_SECRET_KEY` - For dashboard authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key

## Repository
- **GitHub**: https://github.com/SpacePlushy/phoenix-precision-agency
- **Live Site**: Auto-deployed via Vercel GitHub integration

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run test suite
- `git push` - Deploy to production

## Agent Usage
- Remember how we have been using our agents to generate and refine website content