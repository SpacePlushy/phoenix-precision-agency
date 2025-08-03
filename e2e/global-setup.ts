import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Global setup started');
  
  // Pre-warm the browser for faster test starts
  const browser = await chromium.launch();
  await browser.close();
  
  console.log('Global setup completed');
}

export default globalSetup;