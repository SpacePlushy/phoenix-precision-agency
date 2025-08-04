import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis, storeLead } from '@/lib/upstash';
import { Lead } from '@/lib/types';
import { Resend } from 'resend';
import { ContactFormData } from '@/components/forms/ContactForm';

// Initialize Resend conditionally
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Helper function to get resend instance (for testing)
const getResendInstance = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return resend || new Resend(process.env.RESEND_API_KEY);
};

// Create a custom rate limiter for contact form (3 per hour per IP) - only if Redis is configured
const contactRateLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/contact',
}) : null;

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    
    // Check rate limit if configured
    let rateLimitHeaders = {};
    if (contactRateLimiter) {
      try {
        const { success, limit, remaining, reset } = await contactRateLimiter.limit(ip);
        
        rateLimitHeaders = {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        };
        
        if (!success) {
          return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429, headers: rateLimitHeaders }
          );
        }
      } catch (_rateLimitError) {
        // If rate limiting fails (e.g., Redis not available), continue without it
        console.log('Rate limiting skipped - Redis not available');
      }
    }

    // Parse request body
    const body: ContactFormData = await request.json();

    // Trim all string inputs
    const trimmedData = {
      name: body.name?.trim(),
      email: body.email?.trim().toLowerCase(),
      phone: body.phone?.trim(),
      company: body.company?.trim(),
      message: body.message?.trim(),
    };

    // Validate required fields
    if (!trimmedData.name || !trimmedData.email || !trimmedData.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Additional validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(trimmedData.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (trimmedData.name.length < 2 || trimmedData.name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

    if (trimmedData.message.length < 10 || trimmedData.message.length > 1000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 1000 characters' },
        { status: 400 }
      );
    }

    // Create lead object
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedData.name,
      email: trimmedData.email,
      phone: trimmedData.phone,
      company: trimmedData.company,
      message: trimmedData.message,
      source: 'contact',
      createdAt: new Date().toISOString(),
    };

    // Store lead in Redis if configured
    if (redis) {
      try {
        await storeLead(lead);
      } catch (_storageError) {
        // Log storage error but don't fail the request
        console.log('Lead storage skipped - Redis not available');
      }
    } else {
      // In demo mode without Redis, just log the lead
      console.log('Demo mode - New lead received:', {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        timestamp: lead.createdAt
      });
    }

    // Send email notification if Resend is configured
    const resendInstance = getResendInstance();
    if (resendInstance && process.env.CONTACT_EMAIL_TO) {
      try {
        await resendInstance.emails.send({
          from: process.env.CONTACT_EMAIL_FROM || 'Phoenix Precision <fmp321@gmail.com>',
          to: process.env.CONTACT_EMAIL_TO,
          subject: `New Contact Form Submission from ${lead.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
            ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${lead.message?.replace(/\n/g, '<br>') || ''}</p>
            <hr>
            <p><small>Submitted at: ${new Date(lead.createdAt).toLocaleString()}</small></p>
          `,
        });
      } catch (_emailError) {
        // Log email error but don't fail the request
        console.log('Email notification skipped - Resend not configured');
      }
    } else {
      // In demo mode without email service, just log
      console.log('Demo mode - Email would be sent to site owner');
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
        id: lead.id,
      },
      { 
        status: 200,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}