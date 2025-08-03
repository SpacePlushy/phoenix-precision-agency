import React from 'react';
import { render, screen } from '@testing-library/react';
import OldSiteView from '../OldSiteView';

describe('OldSiteView', () => {
  it('renders the old site view with correct styling', () => {
    render(<OldSiteView />);
    
    // Check for outdated design elements
    expect(screen.getByText(/WELCOME TO ACME BUSINESS SOLUTIONS/)).toBeInTheDocument();
    expect(screen.getByText('ACME BUSINESS')).toBeInTheDocument();
  });

  it('displays under construction notice', () => {
    render(<OldSiteView />);
    
    const underConstruction = screen.getByText(/SITE UNDER CONSTRUCTION/);
    expect(underConstruction).toBeInTheDocument();
    expect(underConstruction.parentElement).toHaveClass('animate-pulse');
  });

  it('shows visitor counter', () => {
    render(<OldSiteView />);
    
    const visitorCounter = screen.getByAltText('Visitor Counter');
    expect(visitorCounter).toBeInTheDocument();
    expect(visitorCounter).toHaveAttribute('src');
  });

  it('displays navigation links in table format', () => {
    render(<OldSiteView />);
    
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('ABOUT US')).toBeInTheDocument();
    expect(screen.getByText('SERVICES')).toBeInTheDocument();
    expect(screen.getByText('CONTACT')).toBeInTheDocument();
  });

  it('shows outdated service offerings', () => {
    render(<OldSiteView />);
    
    expect(screen.getByText(/Web Design \(HTML 4.0 Compatible!\)/)).toBeInTheDocument();
    expect(screen.getByText(/Y2K Compliance Consulting/)).toBeInTheDocument();
    expect(screen.getByText(/Fax Machine Integration/)).toBeInTheDocument();
    expect(screen.getByText(/CD-ROM Production/)).toBeInTheDocument();
  });

  it('displays broken image placeholders', () => {
    render(<OldSiteView />);
    
    // The text is split with br tags, so we need to check for the containing elements
    expect(screen.getByText(/IMG_0134\.JPG/)).toBeInTheDocument();
    expect(screen.getByText(/404 Error/)).toBeInTheDocument();
    expect(screen.getByText(/PHOTO23\.BMP/)).toBeInTheDocument();
    expect(screen.getByText(/File Not Found/)).toBeInTheDocument();
  });

  it('shows outdated footer information', () => {
    render(<OldSiteView />);
    
    expect(screen.getByText(/Best viewed in Internet Explorer 5.0/)).toBeInTheDocument();
    expect(screen.getByText('Webmaster')).toBeInTheDocument();
    expect(screen.getByText('Sign Guestbook')).toBeInTheDocument();
    expect(screen.getByText('WebRing')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(<OldSiteView className="test-class" />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('test-class');
    // The background is now bg-amber-50, not bg-yellow-300
    expect(mainDiv).toHaveClass('bg-amber-50');
  });

  it('has proper accessibility structure', () => {
    render(<OldSiteView />);
    
    // Check for heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('ACME BUSINESS');
    
    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent(/SITE UNDER CONSTRUCTION/);
    
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('Welcome to the Future of Business!');
  });

  it('uses Times New Roman font for retro feel', () => {
    render(<OldSiteView />);
    
    const heading = screen.getByText('ACME BUSINESS');
    expect(heading).toHaveClass("font-['Times_New_Roman',serif]");
  });
});