# Phoenix Precision Agency

Transform your business with aerospace-grade precision and modern web solutions.

## 🚀 Overview

Phoenix Precision Agency specializes in transforming outdated websites into modern, high-performing digital experiences that drive results. With NASA-grade engineering precision, we deliver exceptional web solutions for Phoenix businesses.

### ✨ Key Features

- **🎨 Modern Design**: Clean, professional layouts optimized for conversions
- **⚡ Lightning Performance**: Sub-2s load times with 99.9% uptime guarantee  
- **🔍 SEO Optimized**: Built-in SEO best practices for better visibility
- **📱 Fully Responsive**: Perfect display on all devices and screen sizes
- **📧 Contact Management**: Integrated contact form with rate limiting and storage
- **📊 Analytics**: Built-in demo analytics and performance tracking
- **🎯 Interactive Demo**: Before/after comparison tool for prospects

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion
- **Database**: Upstash Redis (optional)
- **Email**: Resend (optional)
- **Auth**: Clerk (optional)
- **Testing**: Jest + Playwright

## 📞 Contact Information

- **Email**: fmp321@gmail.com
- **Phone**: (602) 531-4111

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/SpacePlushy/phoenix-precision-agency.git
cd phoenix-precision-agency
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure environment variables (all optional):**
   - `UPSTASH_REDIS_REST_URL` - For lead storage and analytics
   - `UPSTASH_REDIS_REST_TOKEN` - Redis authentication
   - `RESEND_API_KEY` - For email notifications
   - `CONTACT_EMAIL_TO` - Where to send form submissions (default: fmp321@gmail.com)
   - Clerk variables for admin dashboard (optional)

5. **Run the development server:**
```bash
npm run dev
# or
yarn dev
# or  
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## 🧪 Testing

### Unit Tests
```bash
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### End-to-End Tests
```bash
npm run test:e2e         # Run E2E tests
npm run test:e2e:headed  # Run E2E tests with browser UI
npm run test:e2e:ui      # Interactive test runner
```

## 🚢 Deployment

The site is automatically deployed via Vercel's GitHub integration. Simply push to the main branch:

```bash
git push origin main
```

### Manual Deployment
```bash
npm run build  # Build for production
npm start      # Start production server
```

## 🏗️ Project Structure

```
phoenix-precision-agency/
├── app/                    # Next.js App Router
│   ├── (marketing)/       # Marketing pages (public)
│   ├── (dashboard)/       # Admin dashboard (protected)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── demo/             # Interactive demo components
│   └── forms/            # Form components
├── lib/                  # Utility functions and configurations
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── e2e/                  # End-to-end tests
```

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and better DX
- **Prettier**: Code formatting (via ESLint)

### Environment Modes
- **Development**: Full debugging, hot reload
- **Production**: Optimized build, analytics enabled
- **Demo Mode**: Works without external services configured

### Key Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
```

## 🎯 Features

### Interactive Demo
- Before/after website comparison
- Real-time analytics tracking
- Engagement metrics
- Performance demonstrations

### Contact Management
- Rate-limited contact form
- Email notifications via Resend
- Lead storage in Redis
- Spam protection

### Performance Optimizations
- Image optimization with Next.js
- Code splitting and lazy loading
- Font optimization with fallbacks
- CSS-in-JS with Tailwind

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast support

## 📈 Analytics & Monitoring

- Demo interaction tracking
- Performance monitoring
- Error tracking
- User engagement metrics

## 🔒 Security

- Rate limiting for API endpoints
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Run the test suite
6. Submit a pull request

## 📄 License

© 2024 Phoenix Precision Agency. All rights reserved.