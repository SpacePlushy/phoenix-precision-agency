import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock the DemoContainer component to avoid complex timer logic in tests
jest.mock('@/components/demo/DemoContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="demo-container">Demo Container</div>,
}));

describe('Home Page', () => {
  it('renders the hero section', () => {
    render(<Home />);
    
    expect(screen.getByText('Transform Your Business Online')).toBeInTheDocument();
    expect(screen.getByText(/We turn outdated websites into modern digital experiences/)).toBeInTheDocument();
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
    
    expect(screen.getByText('Ready to Leave Your Competition Behind?')).toBeInTheDocument();
    expect(screen.getByText(/Let's discuss how we can transform your digital presence/)).toBeInTheDocument();
    
    const consultationLink = screen.getByText('Get Your Free Consultation');
    expect(consultationLink).toBeInTheDocument();
    expect(consultationLink).toHaveAttribute('href', '/contact');
  });

  it('has proper heading hierarchy', () => {
    render(<Home />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Transform Your Business Online');
    
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements).toHaveLength(2); // Features and CTA sections
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements).toHaveLength(3); // Three feature cards
  });

  it('uses semantic HTML structure', () => {
    render(<Home />);
    
    // Check for section elements
    const container = screen.getByText('Transform Your Business Online').closest('section');
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
    expect(startButton).toHaveClass('hover:opacity-90');
    
    const viewWorkButton = screen.getByText('View Our Work');
    expect(viewWorkButton).toHaveClass('hover:bg-[var(--color-accent)]', 'hover:text-white');
    
    const featureCard = screen.getByText('Data-Driven Design').parentElement;
    expect(featureCard).toHaveClass('hover:shadow-lg');
  });
});