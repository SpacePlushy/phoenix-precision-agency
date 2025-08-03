import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the DemoContainer component to avoid complex timer logic in tests
jest.mock('@/components/demo/DemoContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="demo-container">Demo Container</div>,
}));

// Mock the PerformanceMetrics component
jest.mock('@/components/PerformanceMetrics', () => ({
  __esModule: true,
  default: () => <div data-testid="performance-metrics">Performance Metrics</div>,
}));

describe('Home Page', () => {
  it('renders the hero section', () => {
    render(<Home />);
    
    expect(screen.getByText('Transform Your Business with')).toBeInTheDocument();
    expect(screen.getByText('Aerospace Precision')).toBeInTheDocument();
    expect(screen.getByText(/We turn outdated websites into modern digital experiences/)).toBeInTheDocument();
  });

  it('displays trust indicators in hero section', () => {
    render(<Home />);
    
    expect(screen.getByText('Trusted by businesses worldwide')).toBeInTheDocument();
    expect(screen.getByText('99.9% Uptime')).toBeInTheDocument();
    expect(screen.getByText('NASA-Grade Security')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });

  it('displays call-to-action buttons', () => {
    render(<Home />);
    
    const startTransformationLink = screen.getByText('Start Your Transformation');
    expect(startTransformationLink).toBeInTheDocument();
    expect(startTransformationLink).toHaveAttribute('href', '/contact');
    
    const viewWorkLink = screen.getByText('View Our Work');
    expect(viewWorkLink).toBeInTheDocument();
    expect(viewWorkLink).toHaveAttribute('href', '/portfolio');
  });

  it('applies correct styling to CTA buttons', () => {
    render(<Home />);
    
    const primaryButton = screen.getByText('Start Your Transformation');
    // The link element has the button classes
    expect(primaryButton).toHaveClass('bg-accent', 'hover:bg-accent/90');
    
    const secondaryButton = screen.getByText('View Our Work');
    // The link element has the button classes
    expect(secondaryButton).toHaveClass('border-background/20', 'hover:bg-background/10');
  });

  it('renders the demo container', () => {
    render(<Home />);
    
    expect(screen.getByTestId('demo-container')).toBeInTheDocument();
  });

  it('displays the features section', () => {
    render(<Home />);
    
    expect(screen.getByText('Why Choose Phoenix Precision?')).toBeInTheDocument();
    expect(screen.getByText(/We deliver more than just websites/)).toBeInTheDocument();
  });

  it('shows all three feature cards', () => {
    render(<Home />);
    
    expect(screen.getByText('Data-Driven Design')).toBeInTheDocument();
    expect(screen.getByText(/Every decision backed by analytics/)).toBeInTheDocument();
    
    expect(screen.getByText('Custom Solutions')).toBeInTheDocument();
    expect(screen.getByText(/Tailored to your unique business needs/)).toBeInTheDocument();
    
    expect(screen.getByText('Proven Results')).toBeInTheDocument();
    expect(screen.getByText(/Track record of increasing conversions/)).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    render(<Home />);
    
    // Check for actual CTA text in the page
    expect(screen.getByText('Ready to Transform Your Business?')).toBeInTheDocument();
    expect(screen.getByText(/Let's discuss how we can elevate your digital presence/)).toBeInTheDocument();
    
    const consultationText = screen.getByText('Get Your Free Consultation');
    expect(consultationText).toBeInTheDocument();
    const consultationLink = consultationText.closest('a');
    expect(consultationLink).toHaveAttribute('href', '/contact');
  });

  it('displays premium badge and guarantees in CTA section', () => {
    render(<Home />);
    
    expect(screen.getByText('Free Consultation')).toBeInTheDocument();
    expect(screen.getByText('30-Day Guarantee')).toBeInTheDocument();
    expect(screen.getByText('NASA Engineer')).toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<Home />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Transform Your Business withAerospace Precision');
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements).toHaveLength(3); // Performance metrics, Features and CTA sections
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements).toHaveLength(3); // Three feature cards
  });

  it('uses semantic HTML structure', () => {
    render(<Home />);
    
    // Check for section elements
    const container = screen.getByText('Transform Your Business with').closest('section');
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe('SECTION');
  });

  it('applies responsive classes', () => {
    render(<Home />);
    
    // Check hero buttons container
    const heroButtonsContainer = screen.getByText('Start Your Transformation').parentElement;
    expect(heroButtonsContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    
    // Check features grid
    const featuresGrid = screen.getByText('Data-Driven Design').closest('.grid');
    expect(featuresGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-3');
  });

  it('includes hover effects on interactive elements', () => {
    render(<Home />);
    
    const startButton = screen.getByText('Start Your Transformation');
    expect(startButton).toHaveClass('bg-accent', 'hover:bg-accent/90');
    
    const viewWorkButton = screen.getByText('View Our Work');
    expect(viewWorkButton).toHaveClass('hover:bg-background/10');
    
    // Check feature cards for enhanced hover effects
    const featureCards = screen.getAllByRole('heading', { level: 3 }).map(h => h.closest('.group'));
    featureCards.forEach(card => {
      if (card) {
        expect(card).toHaveClass('hover:shadow-lg', 'transition-all', 'duration-300');
      }
    });
  });

  describe('Card Enhancements', () => {
    it('applies new Card component styling', () => {
      render(<Home />);
      
      // Check hero trust indicators card - find the actual Card element
      const trustText = screen.getByText('Trusted by businesses worldwide');
      const trustCard = trustText.closest('[class*="rounded-lg"][class*="border"]');
      expect(trustCard).toHaveClass('bg-background/10', 'border-background/20', 'backdrop-blur-sm');
      
      // Check feature cards
      const featureSection = screen.getByText('Why Choose Phoenix Precision?').closest('section');
      const cards = featureSection?.querySelectorAll('.rounded-lg.border');
      
      if (cards && cards.length > 0) {
        expect(cards.length).toBe(3);
        Array.from(cards).forEach(card => {
          expect(card).toHaveClass('hover:shadow-lg', 'transition-all', 'duration-300');
        });
      }
    });

    it('includes gradient effects on feature cards', () => {
      render(<Home />);
      
      // Check for gradient backgrounds - the aerospace gradient sections
      const gradientElements = document.querySelectorAll('.aerospace-gradient, .bg-gradient-to-r');
      expect(gradientElements.length).toBeGreaterThan(0);
      
      // Check for blur effects
      const blurElements = document.querySelectorAll('.blur-3xl, .blur-sm');
      expect(blurElements.length).toBeGreaterThan(0);
    });

    it('applies hover scale effects to icons', () => {
      render(<Home />);
      
      // Check for icon containers with hover effects - the icon divs have group-hover:bg-accent
      const iconContainers = document.querySelectorAll('.group-hover\\:bg-accent');
      expect(iconContainers.length).toBeGreaterThan(0);
    });
  });

  describe('Theme and Colors', () => {
    it('uses new aerospace gradient backgrounds', () => {
      render(<Home />);
      
      const sections = document.querySelectorAll('.aerospace-gradient, .aerospace-gradient-subtle');
      expect(sections.length).toBeGreaterThan(0);
    });

    it('applies correct badge styling', () => {
      render(<Home />);
      
      // Check trust badges
      const badges = screen.getAllByRole('generic').filter(el => el.classList.contains('bg-emerald-500/20') || el.classList.contains('bg-gold/20') || el.classList.contains('bg-blue-500/20'));
      expect(badges.length).toBeGreaterThan(0);
      
      badges.forEach(badge => {
        expect(badge).toHaveClass('transition-all');
      });
    });
  });
});