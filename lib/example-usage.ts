/**
 * Example usage of Upstash Redis utilities
 * This file demonstrates how to use the Redis configuration and analytics
 */

import { 
  storeLead, 
  getLead, 
  getRecentLeads,
  rateLimiter,
} from './upstash';
import {
  generateSessionId,
  trackDemoStart,
  trackDemoEnd,
  trackDemoInteraction,
  getAnalyticsSummary,
  compareVersionPerformance,
} from './analytics';
import type { Lead } from './types';

// Example 1: Storing and retrieving leads
async function leadExample() {
  // Store a new lead
  const newLead: Lead = {
    id: 'lead-' + Date.now(),
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    company: 'Acme Corp',
    message: 'Interested in your services',
    source: 'contact',
    createdAt: new Date().toISOString(),
  };

  await storeLead(newLead);
  console.log('Lead stored successfully');

  // Retrieve the lead
  const retrievedLead = await getLead(newLead.id);
  console.log('Retrieved lead:', retrievedLead);

  // Get recent leads
  const recentLeads = await getRecentLeads(10);
  console.log('Recent leads:', recentLeads);
}

// Example 2: Demo analytics tracking
async function demoAnalyticsExample() {
  const sessionId = generateSessionId();
  
  // Start tracking a demo session
  await trackDemoStart(sessionId, 'new');
  console.log('Demo tracking started');

  // Simulate user interactions
  for (let i = 0; i < 5; i++) {
    await trackDemoInteraction(sessionId);
    // Simulate some delay between interactions
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // End the demo session
  await trackDemoEnd(sessionId);
  console.log('Demo tracking ended');

  // Get analytics summary
  const summary = await getAnalyticsSummary(7);
  console.log('Analytics summary:', summary);

  // Compare version performance
  const comparison = await compareVersionPerformance(30);
  console.log('Version comparison:', comparison);
}

// Example 3: Rate limiting
async function rateLimitExample() {
  const userIp = '192.168.1.100';
  
  // Check rate limit
  const result = await rateLimiter.limit(userIp);
  
  if (result.success) {
    console.log('Request allowed. Remaining:', result.remaining);
    // Process the request
  } else {
    console.log('Rate limit exceeded. Reset at:', new Date(result.reset));
    // Return 429 Too Many Requests
  }
}

// Example 4: Using in API routes
export async function handleContactFormSubmission(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  // Check rate limit first
  const rateLimitResult = await rateLimiter.limit(formData.email);
  
  if (!rateLimitResult.success) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    };
  }

  // Create and store the lead
  const lead: Lead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...formData,
    source: 'contact',
    createdAt: new Date().toISOString(),
  };

  try {
    await storeLead(lead);
    return {
      success: true,
      message: 'Thank you for your interest. We will contact you soon.',
    };
  } catch (error) {
    console.error('Error storing lead:', error);
    return {
      success: false,
      error: 'An error occurred. Please try again.',
    };
  }
}

// Example 5: Dashboard data retrieval
export async function getDashboardData() {
  const [recentLeads, analyticsSummary, versionComparison] = await Promise.all([
    getRecentLeads(10),
    getAnalyticsSummary(30),
    compareVersionPerformance(30),
  ]);

  return {
    leads: {
      recent: recentLeads,
      total: recentLeads.length, // In real app, you'd have a separate count function
    },
    analytics: {
      summary: analyticsSummary,
      versionComparison,
    },
  };
}

// Run examples (commented out to prevent execution on import)
// leadExample().catch(console.error);
// demoAnalyticsExample().catch(console.error);
// rateLimitExample().catch(console.error);