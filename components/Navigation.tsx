"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-background px-4 py-2 rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        Skip to main content
      </a>
      
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50" aria-label="Main navigation">
        <div className="bg-card/80 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
              </div>
              <span className="font-bold text-xl text-foreground">
                Phoenix <span className="text-accent">Precision</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/70 hover:text-foreground font-medium transition-colors duration-200 relative group min-h-[44px] px-3 py-2 flex items-center"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-200"></span>
                </Link>
              ))}
              <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent transition-all">
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-accent transition-colors p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-foreground/70 hover:text-foreground font-medium transition-colors duration-200 py-3 px-4 block min-h-[44px] min-w-[44px] flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/10 hover:text-accent hover:border-accent transition-all w-full min-h-[44px]">
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}