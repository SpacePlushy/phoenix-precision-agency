import { NextResponse } from 'next/server';

// CSP violation report structure
interface CSPReport {
  violation: {
    directive: string;
    blockedURI: string;
    documentURI: string;
    lineNumber?: number;
    columnNumber?: number;
    sourceFile?: string;
  };
  timestamp: string;
  userAgent: string;
  url: string;
}

export async function POST(request: Request) {
  try {
    const report: CSPReport = await request.json();
    
    // In production, you would want to:
    // 1. Log to a monitoring service (e.g., Sentry, LogRocket)
    // 2. Store in a database for analysis
    // 3. Send alerts for critical violations
    
    // For now, we'll just log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('CSP Violation Report:', {
        ...report,
        severity: determineSeverity(report.violation),
      });
    }
    
    // You could integrate with monitoring services here
    // Example: await sendToSentry(report);
    
    return NextResponse.json({ 
      status: 'received',
      message: 'CSP violation report logged successfully' 
    });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 500 }
    );
  }
}

/**
 * Determine severity of CSP violation
 */
function determineSeverity(violation: CSPReport['violation']): 'low' | 'medium' | 'high' {
  // High severity: script-src violations (potential XSS)
  if (violation.directive.includes('script-src')) {
    return 'high';
  }
  
  // Medium severity: connect-src, frame-src (functionality issues)
  if (violation.directive.includes('connect-src') || 
      violation.directive.includes('frame-src')) {
    return 'medium';
  }
  
  // Low severity: style-src, img-src, font-src
  return 'low';
}