import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketingLayout from '../layout';

// Mock the Navigation component
jest.mock('@/components/Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation Component</nav>;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('MarketingLayout', () => {
  const mockChildren = <div data-testid="children">Test Content</div>;

  it('renders navigation, children, and footer', () => {
    render(<MarketingLayout>{mockChildren}</MarketingLayout>);
    
    // Check Navigation component is rendered
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    
    // Check children are rendered
    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    
    // Check footer is rendered
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  describe('Footer', () => {
    it('renders all footer sections', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      // Company info section
      expect(screen.getByText('Phoenix Precision Agency')).toBeInTheDocument();
      expect(screen.getByText(/Transforming businesses with aerospace-grade precision/i)).toBeInTheDocument();
      
      // Quick links section
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      
      // Contact section - use getAllByText since there are multiple
      const contactHeaders = screen.getAllByText('Contact');
      expect(contactHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText(/info@phoenixprecision.agency/i)).toBeInTheDocument();
      expect(screen.getByText(/\(555\) 012-3456/i)).toBeInTheDocument();
    });

    it('renders all navigation links in footer', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footer = screen.getByRole('contentinfo');
      
      // Check all footer links
      const homeLink = footer.querySelector('a[href="/"]');
      const portfolioLink = footer.querySelector('a[href="/portfolio"]');
      const contactLink = footer.querySelector('a[href="/contact"]');
      
      expect(homeLink).toHaveTextContent('Home');
      expect(portfolioLink).toHaveTextContent('Portfolio');
      expect(contactLink).toHaveTextContent('Contact');
    });

    it('applies correct footer styling', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footer = screen.getByRole('contentinfo');
      
      // Check footer classes
      expect(footer).toHaveClass('bg-primary', 'text-primary-foreground', 'py-12', 'mt-24');
      
      // Check grid layout
      const gridContainer = footer.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3', 'gap-8');
    });

    it('renders copyright information', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(/© 2024 Phoenix Precision Agency. All rights reserved./)).toBeInTheDocument();
    });

    it('applies hover effects to footer links', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footer = screen.getByRole('contentinfo');
      const links = footer.querySelectorAll('a');
      
      links.forEach(link => {
        if (link.getAttribute('href')?.startsWith('/')) {
          expect(link).toHaveClass('hover:text-accent', 'transition-colors');
        }
      });
    });
  });

  describe('Layout Structure', () => {
    it('wraps children in main element', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByTestId('children'));
    });

    it('maintains correct DOM hierarchy', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const navigation = screen.getByTestId('navigation');
      const main = screen.getByRole('main');
      const footer = screen.getByRole('contentinfo');
      
      // Check order
      const parent = navigation.parentElement;
      const elements = Array.from(parent?.children || []);
      
      expect(elements[0]).toBe(navigation);
      expect(elements[1]).toBe(main);
      expect(elements[2]).toBe(footer);
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid in footer', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const gridContainer = screen.getByRole('contentinfo').querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('applies responsive padding', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footerContent = screen.getByText('Phoenix Precision Agency').closest('.max-w-6xl');
      expect(footerContent).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML elements', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('maintains proper heading hierarchy', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footer = screen.getByRole('contentinfo');
      
      // Check h3 for main footer title
      const mainTitle = footer.querySelector('h3');
      expect(mainTitle).toHaveTextContent('Phoenix Precision Agency');
      
      // Check h4 for section titles
      const sectionTitles = footer.querySelectorAll('h4');
      expect(sectionTitles).toHaveLength(2);
      expect(sectionTitles[0]).toHaveTextContent('Quick Links');
      expect(sectionTitles[1]).toHaveTextContent('Contact');
    });
  });

  describe('Theme and Styling', () => {
    it('applies correct color scheme to footer', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('bg-primary', 'text-primary-foreground');
      
      // Check border color for divider
      const divider = footer.querySelector('.border-t');
      expect(divider).toHaveClass('border-white/20');
    });

    it('applies correct spacing', () => {
      render(<MarketingLayout>{mockChildren}</MarketingLayout>);
      
      // Check footer spacing
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('py-12', 'mt-24');
      
      // Check copyright section spacing
      const copyrightSection = screen.getByText(/© 2024/).parentElement;
      expect(copyrightSection).toHaveClass('mt-8', 'pt-8');
    });
  });
});