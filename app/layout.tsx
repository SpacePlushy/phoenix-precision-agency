import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Phoenix Precision Agency - Professional Web Development & Digital Solutions",
    template: "%s | Phoenix Precision Agency"
  },
  description: "Transform your business online with Phoenix Precision Agency. We create modern, high-performance websites that drive growth, engage customers, and deliver measurable results.",
  keywords: ["web development", "digital agency", "website design", "SEO", "performance optimization", "business growth"],
  authors: [{ name: "Phoenix Precision Agency" }],
  creator: "Phoenix Precision Agency",
  publisher: "Phoenix Precision Agency",
  metadataBase: new URL('https://phoenixprecision.agency'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://phoenixprecision.agency',
    title: 'Phoenix Precision Agency - Professional Web Development & Digital Solutions',
    description: 'Transform your business online with Phoenix Precision Agency. We create modern, high-performance websites that drive growth, engage customers, and deliver measurable results.',
    siteName: 'Phoenix Precision Agency',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Phoenix Precision Agency - Professional Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Precision Agency - Professional Web Development & Digital Solutions',
    description: 'Transform your business online with Phoenix Precision Agency. We create modern, high-performance websites that drive growth.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Phoenix Precision Agency",
    "description": "Professional web development and digital solutions agency",
    "url": "https://phoenixprecision.agency",
    "logo": "https://phoenixprecision.agency/logo.png",
    "sameAs": [
      "https://twitter.com/phoenixprecision",
      "https://linkedin.com/company/phoenix-precision-agency"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-602-531-4111",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "serviceType": [
      "Web Development",
      "Website Design", 
      "Digital Marketing",
      "SEO Services",
      "Performance Optimization"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
