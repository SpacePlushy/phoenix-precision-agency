import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoContainer from '../DemoContainer';

// Mock the child components
jest.mock('../OldSiteView', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="old-site-view">Old Site View</div>
  ),
}));

jest.mock('../NewSiteView', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="new-site-view">New Site View</div>
  ),
}));

describe('DemoContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders header section with title and description', () => {
    render(<DemoContainer />);
    
    expect(screen.getByText('See the Transformation')).toBeInTheDocument();
    expect(screen.getByText(/Watch how we transform outdated websites/)).toBeInTheDocument();
  });

  it('displays Before and After buttons', () => {
    render(<DemoContainer />);
    
    // The buttons now have different text content
    expect(screen.getByRole('button', { name: /2005 Website/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modern Website/i })).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    render(<DemoContainer />);
    
    const progressBar = document.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('initially shows old view as active', () => {
    render(<DemoContainer />);
    
    const beforeButton = screen.getByRole('button', { name: /2005 Website/i });
    expect(beforeButton.parentElement).toHaveClass('shadow-lg', 'scale-105');
    
    const afterButton = screen.getByRole('button', { name: /Modern Website/i });
    expect(afterButton.parentElement).not.toHaveClass('shadow-lg', 'scale-105');
  });

  it('auto-switches between views after 3 seconds', async () => {
    render(<DemoContainer />);
    
    // Initially old view is active
    const beforeButton = screen.getByRole('button', { name: /2005 Website/i });
    expect(beforeButton.parentElement).toHaveClass('shadow-lg', 'scale-105');
    
    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);
    
    // Should switch to new view
    await waitFor(() => {
      const afterButton = screen.getByRole('button', { name: /Modern Website/i });
      expect(afterButton.parentElement).toHaveClass('shadow-lg', 'scale-105');
    });
  });

  it('updates progress bar over time', async () => {
    render(<DemoContainer />);
    
    const progressBar = document.querySelector('[style*="width"]') as HTMLElement;
    const initialWidth = progressBar.style.width;
    
    // Advance timer by 1 second
    jest.advanceTimersByTime(1000);
    
    await waitFor(() => {
      const updatedWidth = progressBar.style.width;
      expect(parseInt(updatedWidth)).toBeGreaterThan(parseInt(initialWidth));
    });
  });

  it('switches view when Before button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DemoContainer />);
    
    // Switch to new view first
    const afterButton = screen.getByRole('button', { name: /Modern Website/i });
    await user.click(afterButton);
    
    // Click Before button
    const beforeButton = screen.getByRole('button', { name: /2005 Website/i });
    await user.click(beforeButton);
    
    expect(beforeButton.parentElement).toHaveClass('shadow-lg', 'scale-105');
    expect(afterButton.parentElement).not.toHaveClass('shadow-lg', 'scale-105');
  });

  it('switches view when After button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DemoContainer />);
    
    const afterButton = screen.getByRole('button', { name: /Modern Website/i });
    await user.click(afterButton);
    
    expect(afterButton.parentElement).toHaveClass('shadow-lg', 'scale-105');
  });

  it('pauses auto-switching when user clicks a view', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DemoContainer />);
    
    // Click After button
    const afterButton = screen.getByRole('button', { name: /Modern Website/i });
    await user.click(afterButton);
    
    // Progress should reset
    const progressBar = document.querySelector('[style*="width"]') as HTMLElement;
    expect(progressBar.style.width).toBe('0%');
    
    // Advance timer less than pause time
    jest.advanceTimersByTime(500);
    
    // Progress should still be 0
    expect(progressBar.style.width).toBe('0%');
  });

  it('renders call-to-action section', () => {
    render(<DemoContainer />);
    
    expect(screen.getByText('Ready to Leave 2005 Behind?')).toBeInTheDocument();
    expect(screen.getByText('Get Your Free Transformation Plan')).toBeInTheDocument();
  });

  it('shows side-by-side view on desktop', () => {
    render(<DemoContainer />);
    
    // Check for desktop grid layout
    const desktopGrid = document.querySelector('.hidden.lg\\:grid.grid-cols-2');
    expect(desktopGrid).toBeInTheDocument();
  });

  it('shows single view with transition on mobile', () => {
    render(<DemoContainer />);
    
    // Check for mobile container
    const mobileContainer = document.querySelector('.lg\\:hidden.relative');
    expect(mobileContainer).toBeInTheDocument();
  });

  it('handles view click on desktop layout', async () => {
    render(<DemoContainer />);
    
    // Find the desktop cards
    const desktopCards = document.querySelectorAll('.hidden.lg\\:grid .relative.group');
    const oldSiteCard = desktopCards[0]?.querySelector('[class*="Card"]');
    const newSiteCard = desktopCards[1]?.querySelector('[class*="Card"]');
    
    expect(oldSiteCard).toBeTruthy();
    expect(newSiteCard).toBeTruthy();
    
    // Initially old view should be active
    expect(oldSiteCard).toHaveClass('scale-105');
    
    // Click on new site view
    if (newSiteCard) {
      fireEvent.click(newSiteCard);
      
      await waitFor(() => {
        expect(newSiteCard).toHaveClass('scale-105');
        expect(oldSiteCard).not.toHaveClass('scale-105');
      });
    }
  });

  it('applies correct labels to views', () => {
    render(<DemoContainer />);
    
    // Check for Before/After labels in badges
    const beforeLabels = screen.getAllByText(/BEFORE \(2005\)/i);
    expect(beforeLabels.length).toBeGreaterThan(0);
    
    const afterLabels = screen.getAllByText(/AFTER \(2024\)/i);
    expect(afterLabels.length).toBeGreaterThan(0);
  });

  describe('Card Enhancements', () => {
    it('applies hover effects to cards', () => {
      render(<DemoContainer />);
      
      // Check desktop cards for hover effects
      const desktopCards = document.querySelectorAll('.hidden.lg\\:grid .relative.group [class*="Card"]');
      expect(desktopCards.length).toBeGreaterThan(0);
      
      desktopCards.forEach(card => {
        expect(card.className).toMatch(/transition-all|duration-500/);
      });
    });

    it('applies correct border hover effects to mobile view', () => {
      render(<DemoContainer />);
      
      // Check mobile view card
      const mobileCard = document.querySelector('.lg\\:hidden.relative [class*="Card"]');
      expect(mobileCard).toBeTruthy();
      expect(mobileCard).toHaveClass('shadow-2xl');
    });

    it('uses CardContent component with proper padding', () => {
      render(<DemoContainer />);
      
      // Check CardContent components - they have p-0 class in the demo views
      const cardContents = document.querySelectorAll('.p-0');
      expect(cardContents.length).toBeGreaterThan(0);
      
      // Check CTA section with padding
      const ctaSection = document.querySelector('.p-12');
      expect(ctaSection).toBeInTheDocument();
    });
  });
});