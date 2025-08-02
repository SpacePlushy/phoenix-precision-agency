"use client";

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            {/* Phoenix Logo Placeholder */}
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-xl">PA</span>
            </div>

            {/* Error Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Site Temporarily Unavailable
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Phoenix Precision Agency is experiencing a technical issue. 
                We&apos;re working to restore service as quickly as possible.
              </p>

              {/* Status Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-8">
                <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Try refreshing the page in a few minutes</li>
                  <li>• Check our social media for updates</li>
                  <li>• Contact us directly if urgent</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={reset}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                <a
                  href="mailto:support@phoenixprecision.agency"
                  className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Contact Support
                </a>
              </div>

              {/* Company Info */}
              <div className="text-sm text-gray-500">
                <p className="mb-2">
                  <strong>Phoenix Precision Agency</strong><br />
                  Professional Web Development & Digital Solutions
                </p>
                <p>
                  Phone: +1-555-0123<br />
                  Email: support@phoenixprecision.agency
                </p>
              </div>
            </div>

            {/* Additional Help */}
            <p className="text-sm text-gray-500 mt-6">
              Error occurred at {new Date().toLocaleString()}
              {error.digest && ` • ID: ${error.digest}`}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}