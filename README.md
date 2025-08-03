# Phoenix Precision Agency

Transform your business with aerospace-grade precision and modern web solutions.

## Overview

Phoenix Precision Agency specializes in transforming outdated websites into modern, high-performing digital experiences that drive results. With NASA-grade engineering precision, we deliver exceptional web solutions for Phoenix businesses.

## Features

- **Modern Design**: Clean, professional layouts optimized for conversions
- **Performance**: Lightning-fast load times with 99.9% uptime guarantee
- **SEO Optimized**: Built-in SEO best practices for better visibility
- **Responsive**: Perfect display on all devices
- **Contact Management**: Integrated contact form with rate limiting and storage

## Contact Information

- **Email**: fmp3212@gmail.com
- **Phone**: (602) 531-4111

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SpacePlushy/phoenix-precision-agency.git
cd phoenix-precision-agency
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure environment variables (all optional):
   - `UPSTASH_REDIS_REST_URL` - For lead storage
   - `UPSTASH_REDIS_REST_TOKEN` - Redis authentication
   - `RESEND_API_KEY` - For email notifications
   - `CONTACT_EMAIL_TO` - Where to send form submissions (default: fmp3212@gmail.com)

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Database**: Upstash Redis (optional)
- **Email**: Resend (optional)
- **Authentication**: Clerk (optional)

## Deployment

The site is automatically deployed via Vercel's GitHub integration. Simply push to the main branch:

```bash
git push origin main
```

## Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

## License

© 2024 Phoenix Precision Agency. All rights reserved.