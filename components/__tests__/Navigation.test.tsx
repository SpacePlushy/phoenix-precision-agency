import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../Navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: ({ size }: any) => <div data-testid="menu-icon" data-size={size}>Menu</div>,
  X: ({ size }: any) => <div data-testid="x-icon" data-size={size}>X</div>,
}));

describe('Navigation', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      // Mock desktop viewport
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));
    });

    it('renders navigation with all links', () => {
      render(<Navigation />);
      
      // Check logo
      expect(screen.getByText('P')).toBeInTheDocument();
      expect(screen.getByText('Phoenix')).toBeInTheDocument();
      expect(screen.getByText('Precision')).toBeInTheDocument();
      
      // Check navigation links
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio');
      // CTA button text is 'Get Started', not 'Contact'
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks).toHaveLength(1); // Only nav link, CTA has different text
      
      // Check CTA button
      const ctaButton = screen.getByRole('link', { name: /get started/i });
      expect(ctaButton).toHaveAttribute('href', '/contact');
      // The Button component itself has the classes, not its parent
      expect(ctaButton).toHaveClass('border-muted-foreground/20');
    });

    it('applies correct styling classes', () => {
      render(<Navigation />);
      
      // Check sticky navigation
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50', 'backdrop-blur-md');
      
      // Check Card component wrapper
      const card = nav.querySelector('.bg-card.shadow-sm');
      expect(card).toBeInTheDocument();
    });

    it('does not show mobile menu button on desktop', () => {
      render(<Navigation />);
      
      // Mobile menu button should be hidden
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('shows mobile menu button', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass('md:hidden');
      
      // Should show Menu icon initially
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Menu should be closed initially
      expect(screen.queryByText(/home/i)).toBeInTheDocument(); // Logo home link
      expect(screen.getAllByText(/home/i)).toHaveLength(1); // Only logo home link visible
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Should show X icon when open
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-icon')).not.toBeInTheDocument();
      
      // All navigation links should be visible
      const homeLinks = screen.getAllByRole('link', { name: /home/i });
      expect(homeLinks.length).toBeGreaterThanOrEqual(2); // Desktop + mobile nav
      
      // Should have 2 portfolio links (desktop + mobile)
      const portfolioLinks = screen.getAllByRole('link', { name: /portfolio/i });
      expect(portfolioLinks.length).toBe(2);
      
      // Should have 2 contact links (desktop + mobile)
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks.length).toBe(2);
      
      // Close menu
      fireEvent.click(menuButton);
      
      // Should show Menu icon when closed
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    it('closes mobile menu when a link is clicked', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Click on a mobile nav link - get the mobile one specifically
      const mobileLinks = screen.getAllByRole('link', { name: /portfolio/i });
      const mobileLink = mobileLinks.find(link => link.classList.contains('py-3'));
      fireEvent.click(mobileLink!);
      
      // Menu should close
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('applies correct mobile menu styling', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);
      
      // Check mobile menu container
      const mobileMenus = document.querySelectorAll('.md\\:hidden.py-4');
      const mobileMenu = Array.from(mobileMenus).find(el => el.classList.contains('border-t'));
      expect(mobileMenu).toBeTruthy();
      expect(mobileMenu).toHaveClass('border-t', 'border-border');
      
      // Check CTA button is full width on mobile
      const ctaButton = screen.getAllByRole('link', { name: /get started/i })[1]; // Mobile CTA
      expect(ctaButton).toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('maintains focus management', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      menuButton.focus();
      expect(document.activeElement).toBe(menuButton);
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Focus should remain on button
      expect(document.activeElement).toBe(menuButton);
    });
  });

  describe('Responsive Design', () => {
    it('hides desktop navigation on mobile breakpoints', () => {
      render(<Navigation />);
      
      // Find the desktop navigation container that has the nav links
      const desktopNav = document.querySelector('.hidden.md\\:flex.items-center.space-x-8');
      expect(desktopNav).toBeInTheDocument();
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    it('shows correct hover effects', () => {
      render(<Navigation />);
      
      const navLinks = screen.getAllByRole('link');
      navLinks.forEach(link => {
        if (link.classList.contains('group')) {
          // Check for hover underline effect
          const underline = link.querySelector('.group-hover\\:w-full');
          if (underline) {
            expect(underline).toHaveClass('transition-all', 'duration-200');
          }
        }
      });
    });
  });

  describe('Theme and Styling', () => {
    it('uses correct color classes', () => {
      render(<Navigation />);
      
      // Check primary colors - The span containing "Phoenix Precision" has text-primary class
      const logoText = screen.getByText((content, element) => {
        return element?.textContent === 'Phoenix Precision';
      });
      expect(logoText).toHaveClass('text-primary');
      
      // Check accent colors - "Precision" is in a nested span with text-accent
      const accentText = screen.getByText('Precision');
      expect(accentText).toHaveClass('text-accent');
      
      // Check CTA button colors - it's an outline variant now
      const ctaButton = screen.getByRole('link', { name: /get started/i });
      expect(ctaButton).toHaveClass('border-muted-foreground/20', 'text-primary');
    });

    it('applies gradient effects correctly', () => {
      render(<Navigation />);
      
      // Check logo gradient
      const logoContainer = screen.getByText('P').parentElement;
      expect(logoContainer).toHaveClass('bg-gradient-to-br', 'from-primary', 'to-accent');
      
      // Check gradient blur effect
      const blurElement = logoContainer?.previousElementSibling;
      expect(blurElement).toHaveClass('bg-gradient-to-br', 'from-accent', 'to-primary', 'blur-sm');
    });
  });
});