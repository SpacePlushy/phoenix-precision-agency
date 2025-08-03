import React from 'react';
import { render, screen } from '@testing-library/react';
import NewSiteView from '../NewSiteView';

describe('NewSiteView', () => {
  it('renders modern navigation bar', () => {
    render(<NewSiteView />);
    
    expect(screen.getByText('Phoenix Precision')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('displays hero section with call-to-action', () => {
    render(<NewSiteView />);
    
    // The text is split with a span, so we need to check the parent element
    const heroHeading = screen.getByRole('heading', { level: 2 });
    expect(heroHeading).toHaveTextContent(/Transform Your.*Digital Presence/);
    expect(screen.getByText(/Modern web solutions that drive growth/)).toBeInTheDocument();
    expect(screen.getByText('View Our Work')).toBeInTheDocument();
    expect(screen.getByText('Schedule a Call')).toBeInTheDocument();
  });

  it('shows social proof statistics', () => {
    render(<NewSiteView />);
    
    expect(screen.getByText('98%')).toBeInTheDocument();
    expect(screen.getByText('Client Satisfaction')).toBeInTheDocument();
    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('Projects Delivered')).toBeInTheDocument();
    expect(screen.getByText('3x')).toBeInTheDocument();
    expect(screen.getByText('Average ROI Increase')).toBeInTheDocument();
  });

  it('displays feature cards with icons', () => {
    render(<NewSiteView />);
    
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText(/Optimized for speed/)).toBeInTheDocument();
    
    expect(screen.getByText('Mobile First')).toBeInTheDocument();
    expect(screen.getByText(/Responsive design/)).toBeInTheDocument();
    
    expect(screen.getByText('Secure & Reliable')).toBeInTheDocument();
    expect(screen.getByText(/Built with security/)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<NewSiteView className="test-class" />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('test-class');
  });

  it('has proper semantic HTML structure', () => {
    render(<NewSiteView />);
    
    // Check for nav element
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Check for heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Phoenix Precision');
    
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent(/Transform Your.*Digital Presence/);
    
    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements.length).toBeGreaterThan(0);
  });

  it('renders responsive design elements', () => {
    render(<NewSiteView />);
    
    // Check for responsive classes
    const heroSection = screen.getByRole('heading', { level: 2 }).parentElement?.parentElement;
    expect(heroSection).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2');
  });

  it('includes accessible button elements', () => {
    render(<NewSiteView />);
    
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    
    const getStartedButton = screen.getByText('Get Started');
    expect(getStartedButton.tagName).toBe('BUTTON');
  });

  it('has hover states on interactive elements', () => {
    render(<NewSiteView />);
    
    const viewWorkButton = screen.getByText('View Our Work').parentElement;
    expect(viewWorkButton).toHaveClass('hover:shadow-2xl');
    
    const scheduleButton = screen.getByText('Schedule a Call').parentElement;
    expect(scheduleButton).toHaveClass('hover:bg-white', 'hover:text-primary');
  });

  it('uses CSS custom properties for theming', () => {
    const { container } = render(<NewSiteView />);
    
    // Check that the component root has the background class
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('bg-background');
  });
});