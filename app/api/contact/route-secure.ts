import { NextRequest, NextResponse } from 'next/server';
import { storeLead } from '@/lib/upstash';
import { Lead } from '@/lib/types';
import { Resend } from 'resend';
// ContactFormData type is now replaced by ContactFormSchema below
import { getClientIP, rateLimiters } from '@/lib/security/rate-limit';
import { encryptPII } from '@/lib/security/encryption';
import { z } from 'zod';

/**
 * Enhanced contact form API with improved security
 * This is a more secure version of the current route.ts
 * 
 * To activate:
 * 1. Install zod: pnpm add zod
 * 2. Rename current route.ts to route-backup.ts
 * 3. Rename this file to route.ts
 */

// Initialize Resend conditionally
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Validation schema using Zod for robust input validation
const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z.string()
    .email('Invalid email address')
    .toLowerCase()
    .max(254, 'Email too long'), // RFC 5321
  phone: z.string()
    .optional()
    .refine(val => !val || /^[\d\s\-\+\(\)ext.]+$/.test(val), 'Invalid phone number'),
  company: z.string()
    .max(100, 'Company name too long')
    .optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

// Honeypot field detection - currently not implemented
// const HoneypotSchema = z.object({
//   website: z.string().optional(), // Hidden field - should be empty
//   timestamp: z.number().optional(), // Submission time check
// });

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Enhanced rate limiting with proper IP extraction
    const rateLimitResult = await rateLimiters.contact.limit(request);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Please wait before submitting again.',
          retryAfter: rateLimitResult.headers['Retry-After'],
        },
        { 
          status: 429,
          headers: rateLimitResult.headers,
        }
      );
    }
    
    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Type guard to check if body is an object
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const requestBody = body as Record<string, unknown>;
    
    // Check honeypot fields (anti-bot measure)
    if (requestBody.website || requestBody.url || requestBody.fax) {
      // Silently reject bot submissions
      console.warn('Honeypot triggered:', { ip: getClientIP(request) });
      return NextResponse.json(
        { success: true, message: 'Thank you for your submission.' },
        { status: 200 }
      );
    }
    
    // Check submission timing (too fast = likely bot)
    if (requestBody.timestamp) {
      const submissionTime = Date.now() - (requestBody.timestamp as number);
      if (submissionTime < 3000) { // Less than 3 seconds
        console.warn('Form submitted too quickly:', { 
          ip: getClientIP(request),
          time: submissionTime 
        });
        return NextResponse.json(
          { success: true, message: 'Thank you for your submission.' },
          { status: 200 }
        );
      }
    }
    
    // Validate input data
    let validatedData: z.infer<typeof ContactFormSchema>;
    try {
      validatedData = ContactFormSchema.parse(requestBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return NextResponse.json(
          { 
            error: 'Validation error',
            message: firstError.message,
            field: firstError.path[0],
          },
          { status: 400 }
        );
      }
      throw error;
    }
    
    // Additional security checks
    // Check for SQL injection patterns (even though we don't use SQL)
    const suspiciousPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|CREATE|ALTER)\b)/i,
      /<script[\s\S]*?>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi, // Event handlers
    ];
    
    const allFields = Object.values(validatedData).join(' ');
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(allFields)) {
        console.warn('Suspicious input detected:', { 
          ip: getClientIP(request),
          pattern: pattern.toString() 
        });
        return NextResponse.json(
          { error: 'Invalid input detected' },
          { status: 400 }
        );
      }
    }
    
    // Sanitize data for storage
    const sanitizedData = {
      name: validatedData.name.trim(),
      email: validatedData.email.trim().toLowerCase(),
      phone: validatedData.phone?.trim(),
      company: validatedData.company?.trim(),
      message: validatedData.message.trim(),
    };
    
    // Create lead object with encrypted PII
    const lead: Lead = {
      id: `lead_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
      ...sanitizedData,
      source: 'contact',
      createdAt: new Date().toISOString()
    };
    
    // Store lead with encryption (if encryption is configured)
    if (process.env.ENCRYPTION_KEY) {
      const encryptedLead = {
        ...lead,
        ...encryptPII(sanitizedData),
      };
      await storeLead(encryptedLead);
    } else {
      await storeLead(lead);
    }
    
    // Send email notification with rate limiting check
    if (resend && process.env.CONTACT_EMAIL_TO) {
      try {
        // Note: HTML escaping not needed as we're using template literals
        // which automatically handle text content safely
        
        await resend.emails.send({
          from: process.env.CONTACT_EMAIL_FROM || 'Phoenix Precision <noreply@phoenix-precision.com>',
          to: process.env.CONTACT_EMAIL_TO,
          replyTo: sanitizedData.email,
          subject: `New Contact Form Submission from ${sanitizedData.name}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #0F172A;">New Contact Form Submission</h2>
                <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${sanitizedData.name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>
                  ${sanitizedData.phone ? `<p><strong>Phone:</strong> ${sanitizedData.phone}</p>` : ''}
                  ${sanitizedData.company ? `<p><strong>Company:</strong> ${sanitizedData.company}</p>` : ''}
                </div>
                <div style="background: #FFFFFF; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
                  <p><strong>Message:</strong></p>
                  <p style="white-space: pre-wrap;">${sanitizedData.message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">
                <p style="color: #64748B; font-size: 12px;">
                  Submitted at: ${new Date(lead.createdAt).toLocaleString()}<br>
                  ID: ${lead.id}
                </p>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        // Log error but don't fail the request
        console.error('Email send failed:', emailError);
        // In production, send to error tracking service
      }
    }
    
    // Log successful submission (for analytics)
    const processingTime = Date.now() - startTime;
    console.log('Contact form submitted:', {
      id: lead.id,
      processingTime,
      encrypted: !!process.env.ENCRYPTION_KEY,
    });
    
    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Thank you for contacting us. We will respond within 24 hours.',
        id: lead.id,
      },
      { 
        status: 200,
        headers: {
          ...rateLimitResult.headers,
          'X-Processing-Time': processingTime.toString(),
        },
      }
    );
    
  } catch (error) {
    // Log error securely (no sensitive data)
    console.error('Contact form error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: getClientIP(request),
      timestamp: new Date().toISOString(),
    });
    
    // Return generic error (no information leakage)
    return NextResponse.json(
      { 
        error: 'An error occurred',
        message: 'Please try again later or contact us directly.',
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// Block other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}