import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../Navigation';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Mock Next.js Link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

// Mock UserMenu component
jest.mock('../UserMenu', () => {
  return function MockUserMenu() {
    return <div data-testid="user-menu">User Menu</div>;
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Menu: ({ size }: any) => <div data-testid="menu-icon" data-size={size}>Menu</div>,
  X: ({ size }: any) => <div data-testid="x-icon" data-size={size}>X</div>,
}));

describe('Navigation', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
    });
  });

  describe('Authentication State Tests', () => {
    it('renders navigation with all links', () => {
      render(<Navigation />);
      
      // Check logo
      expect(screen.getByText('P')).toBeInTheDocument();
      expect(screen.getByText('Phoenix')).toBeInTheDocument();
      expect(screen.getByText('Precision')).toBeInTheDocument();
      
      // Check navigation links
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio');
      const contactLinks = screen.getAllByRole('link', { name: /contact/i });
      expect(contactLinks).toHaveLength(1);
    });

    it('shows sign in and get started buttons when not authenticated', () => {
      render(<Navigation />);
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('shows user menu when authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      
      render(<Navigation />);
      
      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
    });

    it('shows loading skeleton when auth is not loaded', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
      });
      
      render(<Navigation />);
      
      const skeleton = screen.getByRole('status');
      expect(skeleton).toHaveClass('h-10', 'w-24');
    });

    it('transitions from loading to authenticated state', async () => {
      const { rerender } = render(<Navigation />);
      
      // Start with loading state
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
      });
      rerender(<Navigation />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Transition to authenticated
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      rerender(<Navigation />);
      
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.getByTestId('user-menu')).toBeInTheDocument();
      });
    });
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      // Mock desktop viewport
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));
    });

    it('applies correct styling classes', () => {
      render(<Navigation />);
      
      // Check sticky navigation
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50', 'backdrop-blur-md', 'border-b');
      
      // Check Card component wrapper with dark theme
      const card = nav.querySelector('.bg-card\\/80.shadow-lg');
      expect(card).toBeInTheDocument();
    });

    it('does not show mobile menu button on desktop', () => {
      render(<Navigation />);
      
      // Mobile menu button should be hidden
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Mobile Navigation Tests', () => {
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
    
    it('shows mobile auth buttons when not signed in', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);
      
      const signInButtons = screen.getAllByText('Sign In');
      const getStartedButtons = screen.getAllByText('Get Started');
      
      expect(signInButtons).toHaveLength(2); // Desktop and mobile
      expect(getStartedButtons).toHaveLength(2); // Desktop and mobile
    });

    it('shows mobile user menu when authenticated', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);
      
      const userMenus = screen.getAllByTestId('user-menu');
      expect(userMenus).toHaveLength(2); // Desktop and mobile
    });

    it('shows loading skeleton in mobile menu', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: false,
        isSignedIn: false,
      });
      
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);
      
      const skeletons = screen.getAllByRole('status');
      expect(skeletons).toHaveLength(2); // Desktop and mobile
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

  describe('Accessibility Tests', () => {
    it('renders skip navigation link for accessibility', () => {
      render(<Navigation />);
      
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveClass('sr-only');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('has proper ARIA attributes', () => {
      render(<Navigation />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
    });

    it('menu toggle button has proper accessibility', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle menu');
      expect(menuButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });

    it('links have minimum touch target size', () => {
      render(<Navigation />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        if (!link.classList.contains('sr-only')) {
          expect(link).toHaveClass('min-h-[44px]');
        }
      });
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

  describe('Edge Cases', () => {
    it('handles rapid menu toggling', () => {
      render(<Navigation />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Rapidly toggle menu
      for (let i = 0; i < 10; i++) {
        fireEvent.click(menuButton);
      }
      
      // Should end up closed (even number of clicks)
      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks).toHaveLength(1); // Only desktop version
    });

    it('handles auth state changes while menu is open', () => {
      const { rerender } = render(<Navigation />);
      
      // Open mobile menu while not authenticated
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);
      
      expect(screen.getAllByText('Sign In')).toHaveLength(2);
      
      // Change to authenticated state
      (useAuth as jest.Mock).mockReturnValue({
        isLoaded: true,
        isSignedIn: true,
      });
      rerender(<Navigation />);
      
      // Should show user menu instead
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('user-menu')).toHaveLength(2);
    });

    it('handles multiple rapid auth state changes', () => {
      const { rerender } = render(<Navigation />);
      
      // Rapidly change auth states
      for (let i = 0; i < 5; i++) {
        (useAuth as jest.Mock).mockReturnValue({
          isLoaded: true,
          isSignedIn: i % 2 === 0,
        });
        rerender(<Navigation />);
      }
      
      // Should end with signed in state (last i=4, even)
      expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    });
  });

  describe('Theme and Styling', () => {
    it('uses correct color classes', () => {
      render(<Navigation />);
      
      // Check primary colors - The span containing "Phoenix Precision" has text-foreground class
      const logoText = screen.getByText((content, element) => {
        return element?.textContent === 'Phoenix Precision';
      });
      expect(logoText).toHaveClass('text-foreground');
      
      // Check accent colors - "Precision" is in a nested span with text-accent
      const accentText = screen.getByText('Precision');
      expect(accentText).toHaveClass('text-accent');
      
      // Check CTA button colors - it's an outline variant now with accent colors
      const ctaButton = screen.getByRole('link', { name: /get started/i });
      expect(ctaButton).toHaveClass('border-accent/30', 'text-accent');
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
    
    it('applies correct button variants', () => {
      render(<Navigation />);
      
      const signInButton = screen.getByText('Sign In').closest('a');
      const getStartedButton = screen.getByText('Get Started').closest('a');
      
      expect(signInButton).toHaveClass('text-foreground/70', 'hover:text-foreground');
      expect(getStartedButton).toHaveClass('border-accent/30', 'text-accent');
    });
  });
});