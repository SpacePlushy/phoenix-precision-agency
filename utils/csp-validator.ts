/**
 * CSP Validator Utility
 * Helps validate and debug Content Security Policy configurations
 */

export interface CSPViolation {
  directive: string;
  blockedURI: string;
  documentURI: string;
  lineNumber?: number;
  columnNumber?: number;
  sourceFile?: string;
}

export class CSPValidator {
  private violations: CSPViolation[] = [];

  /**
   * Initialize CSP violation reporting
   */
  public initializeReporting() {
    if (typeof window === 'undefined') return;

    // Listen for security policy violation events
    document.addEventListener('securitypolicyviolation', (event) => {
      const violation: CSPViolation = {
        directive: event.violatedDirective,
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
        sourceFile: event.sourceFile,
      };

      this.violations.push(violation);
      
      // Log violation in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('CSP Violation:', violation);
      }

      // Send to reporting endpoint in production
      if (process.env.NODE_ENV === 'production') {
        this.reportViolation(violation);
      }
    });
  }

  /**
   * Get all recorded violations
   */
  public getViolations(): CSPViolation[] {
    return this.violations;
  }

  /**
   * Clear recorded violations
   */
  public clearViolations() {
    this.violations = [];
  }

  /**
   * Report violation to server
   */
  private async reportViolation(violation: CSPViolation) {
    try {
      await fetch('/api/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          violation,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  /**
   * Validate required Clerk domains are included
   */
  public validateClerkDomains(cspHeader: string): string[] {
    const issues: string[] = [];
    const requiredDomains = {
      'script-src': [
        'clerk.accounts.dev',
        'clerk.com',
        'challenges.cloudflare.com',
      ],
      'connect-src': [
        'clerk.accounts.dev',
        'clerk.com',
        'api.clerk.com',
        'clerk-telemetry.com',
      ],
      'img-src': ['img.clerk.com', 'images.clerk.dev'],
      'frame-src': ['challenges.cloudflare.com'],
    };

    Object.entries(requiredDomains).forEach(([directive, domains]) => {
      const directiveRegex = new RegExp(`${directive}[^;]*`, 'i');
      const match = cspHeader.match(directiveRegex);
      
      if (!match) {
        issues.push(`Missing directive: ${directive}`);
        return;
      }

      const directiveContent = match[0];
      domains.forEach((domain) => {
        if (!directiveContent.includes(domain)) {
          issues.push(`Missing domain in ${directive}: ${domain}`);
        }
      });
    });

    // Check for security issues
    if (cspHeader.includes('unsafe-eval')) {
      issues.push("Security Warning: 'unsafe-eval' is present - remove for production");
    }

    if (cspHeader.includes('https:') && !cspHeader.includes('https://')) {
      issues.push("Security Warning: Wildcard 'https:' allows any HTTPS source");
    }

    return issues;
  }

  /**
   * Generate CSP report for debugging
   */
  public generateReport(): string {
    const violations = this.getViolations();
    const groupedViolations = violations.reduce((acc, violation) => {
      const key = `${violation.directive}: ${violation.blockedURI}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let report = '=== CSP Violation Report ===\\n\\n';
    report += `Total Violations: ${violations.length}\\n\\n`;
    
    report += 'Violations by Type:\\n';
    Object.entries(groupedViolations).forEach(([violation, count]) => {
      report += `  ${violation} (${count} occurrences)\\n`;
    });

    if (violations.length > 0) {
      report += '\\nRecent Violations:\\n';
      violations.slice(-5).forEach((v, i) => {
        report += `\\n${i + 1}. ${v.directive}\\n`;
        report += `   Blocked: ${v.blockedURI}\\n`;
        report += `   Page: ${v.documentURI}\\n`;
        if (v.sourceFile) {
          report += `   Source: ${v.sourceFile}:${v.lineNumber}:${v.columnNumber}\\n`;
        }
      });
    }

    return report;
  }
}

// Singleton instance
export const cspValidator = new CSPValidator();

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  cspValidator.initializeReporting();
}