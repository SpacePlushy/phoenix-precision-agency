import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis, storeLead } from '@/lib/upstash';
import { Lead } from '@/lib/types';
import { Resend } from 'resend';
import { ContactFormData } from '@/components/forms/ContactForm';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Create a custom rate limiter for contact form (3 per hour per IP)
const contactRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit/contact',
});

export async function POST(request: NextRequest) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    
    // Check rate limit
    const { success, limit, remaining, reset } = await contactRateLimiter.limit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
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

    // Store lead in Redis
    await storeLead(lead);

    // Send email notification if Resend is configured
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_TO) {
      try {
        await resend.emails.send({
          from: process.env.CONTACT_EMAIL_FROM || 'Phoenix Precision <noreply@phoenixprecision.agency>',
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
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send email notification:', emailError);
      }
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
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
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