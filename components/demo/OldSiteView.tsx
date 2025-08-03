"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface OldSiteViewProps {
  className?: string;
}

export default function OldSiteView({ className = '' }: OldSiteViewProps) {
  return (
    <motion.div 
      className={`${className} bg-amber-50 min-h-[600px] overflow-hidden relative`}
      initial={false}
      style={{ willChange: 'transform' }}
    >
      {/* Browser Chrome */}
      <div className="bg-gray-300 px-4 py-2 flex items-center gap-2 border-b border-gray-400">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4 bg-gray-200 rounded px-3 py-1 text-xs text-gray-700 font-mono">
          http://www.acmebusiness.com/index.html
        </div>
      </div>
      {/* Dated header with marquee effect */}
      <div className="bg-slate-700 text-amber-200 p-2 text-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap font-['Times_New_Roman',serif] text-lg font-bold chrome-optimized">
          🌟 WELCOME TO ACME BUSINESS SOLUTIONS 🌟 YOUR PREMIER BUSINESS PARTNER SINCE 1995 🌟
        </div>
      </div>

      {/* Main content with table-based layout feel */}
      <div className="p-4 h-full">
        <center>
          <div className="font-['Times_New_Roman',serif] text-5xl text-amber-800 font-bold mb-4">
            ACME BUSINESS
          </div>
          
          {/* Animated GIF placeholder */}
          <div className="bg-stone-200 max-w-[468px] w-full h-[60px] mx-auto mb-4 flex items-center justify-center border-2 border-stone-400">
            <span className="text-sm text-stone-600">[ ANIMATED BANNER AD SPACE ]</span>
          </div>

          {/* Under construction notice */}
          <div className="bg-amber-400 text-amber-900 p-2 mb-4 inline-block animate-pulse gpu-accelerated">
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
              loading="lazy"
              decoding="async"
              width="200"
              height="40"
            />
          </div>

          {/* Navigation with broken styling */}
          <div className="mb-4">
            <table className="mx-auto border-4 border-double border-stone-500 bg-amber-200">
              <tbody>
                <tr>
                  <td className="p-2 border-r-2 border-stone-500">
                    <a href="#" className="text-stone-700 underline font-bold hover:text-amber-700">
                      HOME
                    </a>
                  </td>
                  <td className="p-2 border-r-2 border-stone-500">
                    <a href="#" className="text-stone-700 underline font-bold hover:text-amber-700">
                      ABOUT US
                    </a>
                  </td>
                  <td className="p-2 border-r-2 border-stone-500">
                    <a href="#" className="text-stone-700 underline font-bold hover:text-amber-700">
                      SERVICES
                    </a>
                  </td>
                  <td className="p-2">
                    <a href="#" className="text-stone-700 underline font-bold hover:text-amber-700">
                      CONTACT
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Content area with broken images and vintage elements */}
          <div className="bg-stone-50 border-4 border-stone-400 p-4 max-w-[600px] w-full mx-auto mb-4">
            <h3 className="font-['Times_New_Roman',serif] text-2xl text-amber-800 mb-2 text-center">
              Welcome to the Future of Business!
            </h3>
            
            {/* Blinking text */}
            <div className="text-center mb-4">
              <span className="font-['Comic_Sans_MS',cursive] text-red-600 text-lg font-bold animate-pulse gpu-accelerated">
                *** NEW AND IMPROVED WEBSITE ***
              </span>
            </div>
            
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
              <div className="w-[100px] h-[100px] bg-stone-200 border-2 border-stone-400 flex items-center justify-center">
                <span className="text-xs text-stone-600 text-center">IMG_0134.JPG<br/>404 Error</span>
              </div>
              <div className="w-[100px] h-[100px] bg-stone-200 border-2 border-stone-400 flex items-center justify-center">
                <span className="text-xs text-stone-600 text-center">PHOTO23.BMP<br/>File Not Found</span>
              </div>
              <div className="w-[100px] h-[100px] bg-amber-300 border-2 border-amber-600 flex items-center justify-center animate-pulse gpu-accelerated">
                <span className="text-xs text-amber-800 text-center font-bold">CLICK HERE!<br/>💰💰💰</span>
              </div>
            </div>

            <p className="font-['Times_New_Roman',serif] text-lg mb-2 text-center">
              We offer cutting-edge solutions for all your business needs!!!
            </p>
            
            <ul className="text-left list-disc list-inside text-amber-700 font-bold mb-4">
              <li>Web Design (HTML 4.0 Compatible!)</li>
              <li>Y2K Compliance Consulting</li>
              <li>Fax Machine Integration</li>
              <li>CD-ROM Production</li>
              <li>Dial-Up Optimization</li>
              <li>GeoCities Hosting</li>
            </ul>

            {/* Scrolling text */}
            <div className="bg-yellow-200 border-2 border-yellow-500 p-2 mb-4 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap text-sm text-yellow-800 font-bold chrome-optimized">
                🔥 HOT DEALS! 🔥 CALL NOW FOR FREE CONSULTATION! 🔥 LIMITED TIME OFFER! 🔥
              </div>
            </div>

            <p className="text-amber-800 font-bold animate-pulse text-center text-xl gpu-accelerated">
              Call NOW! 1-800-ACME-BIZ
            </p>
            
            {/* Web ring banner */}
            <div className="mt-4 text-center">
              <div className="inline-block bg-blue-200 border-2 border-blue-600 p-2">
                <span className="text-xs text-blue-800 font-bold">Join our WebRing!</span>
              </div>
            </div>
          </div>

          {/* Footer with outdated links */}
          <div className="text-sm text-stone-600">
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
    </motion.div>
  );
}