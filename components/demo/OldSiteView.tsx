"use client";

import React from 'react';

interface OldSiteViewProps {
  className?: string;
}

export default function OldSiteView({ className = '' }: OldSiteViewProps) {
  return (
    <div className={`${className} bg-yellow-300 min-h-[600px] overflow-hidden`}>
      {/* Dated header with marquee effect */}
      <div className="bg-blue-700 text-yellow-300 p-2 text-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap font-['Times_New_Roman',serif] text-lg font-bold">
          🌟 WELCOME TO ACME BUSINESS SOLUTIONS 🌟 YOUR PREMIER BUSINESS PARTNER SINCE 1995 🌟
        </div>
      </div>

      {/* Main content with table-based layout feel */}
      <div className="p-4">
        <center>
          <h1 className="font-['Times_New_Roman',serif] text-5xl text-red-600 font-bold mb-4">
            ACME BUSINESS
          </h1>
          
          {/* Animated GIF placeholder */}
          <div className="bg-gray-300 w-[468px] h-[60px] mx-auto mb-4 flex items-center justify-center border-2 border-black">
            <span className="text-sm">[ ANIMATED BANNER AD SPACE ]</span>
          </div>

          {/* Under construction notice */}
          <div className="bg-orange-500 text-black p-2 mb-4 inline-block animate-pulse">
            <h2 className="font-['Comic_Sans_MS',cursive] text-xl">
              🚧 SITE UNDER CONSTRUCTION 🚧
            </h2>
          </div>

          {/* Visitor counter */}
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='40' viewBox='0 0 200 40'%3E%3Crect width='200' height='40' fill='black'/%3E%3Ctext x='10' y='25' fill='lime' font-family='monospace' font-size='16'%3EVisitors: 0031337%3C/text%3E%3C/svg%3E"
              alt="Visitor Counter"
              className="inline-block"
            />
          </div>

          {/* Navigation with broken styling */}
          <div className="mb-4">
            <table className="mx-auto border-4 border-double border-purple-600 bg-lime-300">
              <tbody>
                <tr>
                  <td className="p-2 border-r-2 border-purple-600">
                    <a href="#" className="text-blue-800 underline font-bold hover:text-red-600">
                      HOME
                    </a>
                  </td>
                  <td className="p-2 border-r-2 border-purple-600">
                    <a href="#" className="text-blue-800 underline font-bold hover:text-red-600">
                      ABOUT US
                    </a>
                  </td>
                  <td className="p-2 border-r-2 border-purple-600">
                    <a href="#" className="text-blue-800 underline font-bold hover:text-red-600">
                      SERVICES
                    </a>
                  </td>
                  <td className="p-2">
                    <a href="#" className="text-blue-800 underline font-bold hover:text-red-600">
                      CONTACT
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Content area with broken images */}
          <div className="bg-white border-4 border-gray-400 p-4 max-w-[600px] mx-auto mb-4">
            <h3 className="font-['Times_New_Roman',serif] text-2xl text-purple-800 mb-2">
              Welcome to the Future of Business!
            </h3>
            
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-600">IMG_0134.JPG</span>
              </div>
              <div className="w-[100px] h-[100px] bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                <span className="text-xs text-gray-600">PHOTO23.BMP</span>
              </div>
            </div>

            <p className="font-['Times_New_Roman',serif] text-lg mb-2">
              We offer cutting-edge solutions for all your business needs!!!
            </p>
            
            <ul className="text-left list-disc list-inside text-green-700 font-bold mb-4">
              <li>Web Design (HTML 4.0 Compatible!)</li>
              <li>Y2K Compliance Consulting</li>
              <li>Fax Machine Integration</li>
              <li>CD-ROM Production</li>
            </ul>

            <p className="text-red-600 font-bold animate-pulse">
              Call NOW! 1-800-ACME-BIZ
            </p>
          </div>

          {/* Footer with outdated links */}
          <div className="text-sm text-blue-800">
            <p>Best viewed in Internet Explorer 5.0 at 800x600</p>
            <p className="mt-2">
              <a href="#" className="underline">Webmaster</a> | 
              <a href="#" className="underline ml-2">Sign Guestbook</a> | 
              <a href="#" className="underline ml-2">WebRing</a>
            </p>
            <p className="mt-2 text-xs">© 1995-2005 ACME Business Solutions</p>
          </div>
        </center>
      </div>
    </div>
  );
}