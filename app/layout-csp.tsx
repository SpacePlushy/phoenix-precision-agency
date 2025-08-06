// CSP Nonce Implementation for RootLayout
// This file shows how to properly implement CSP nonce in your root layout
// Copy this implementation to your app/layout.tsx file

import { headers } from 'next/headers';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the nonce from middleware
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';

  return (
    <html lang="en">
      <head>
        {/* Pass nonce to any inline scripts */}
        <Script
          id="csp-nonce"
          strategy="beforeInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.__CSP_NONCE__ = "${nonce}";`,
          }}
        />
      </head>
      <body>
        {children}
        {/* Any inline scripts must use the nonce */}
        <Script
          id="example-inline"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `console.log('CSP nonce active');`,
          }}
        />
      </body>
    </html>
  );
}

// For any inline styles in components, use the nonce:
// Example component with inline styles:
/*
export async function ComponentWithInlineStyles() {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';
  
  return (
    <div>
      <style nonce={nonce}>
        {`.custom-class { color: blue; }`}
      </style>
      <div className="custom-class">Content</div>
    </div>
  );
}
*/