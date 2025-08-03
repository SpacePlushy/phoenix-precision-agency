'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Phoenix Logo */}
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-white font-bold text-xl">PA</span>
        </div>

        {/* 404 Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-gray-400" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Suggested Actions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check the URL for spelling errors</li>
              <li>• Go back to the previous page</li>
              <li>• Visit our homepage</li>
              <li>• Contact us if you think this is an error</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>

          {/* Popular Pages */}
          <div className="text-sm text-gray-500">
            <p className="mb-2 font-medium">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/portfolio" className="text-blue-600 hover:text-blue-700">
                Portfolio
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                Contact
              </Link>
              <span className="text-gray-300">|</span>
              <a 
                href="mailto:fmp321@gmail.com"
                className="text-blue-600 hover:text-blue-700"
              >
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <p className="text-sm text-gray-500 mt-6">
          <strong>Phoenix Precision Agency</strong><br />
          Professional Web Development & Digital Solutions
        </p>
      </div>
    </div>
  );
}