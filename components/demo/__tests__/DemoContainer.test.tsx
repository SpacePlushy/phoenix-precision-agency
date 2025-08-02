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
    
    expect(screen.getByRole('button', { name: 'Before' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'After' })).toBeInTheDocument();
  });

  it('shows progress bar', () => {
    render(<DemoContainer />);
    
    const progressBar = document.querySelector('[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('initially shows old view as active', () => {
    render(<DemoContainer />);
    
    const beforeButton = screen.getByRole('button', { name: 'Before' });
    expect(beforeButton).toHaveClass('text-[var(--color-accent)]');
    
    const afterButton = screen.getByRole('button', { name: 'After' });
    expect(afterButton).toHaveClass('text-[var(--color-muted)]');
  });

  it('auto-switches between views after 3 seconds', async () => {
    render(<DemoContainer />);
    
    // Initially old view is active
    const beforeButton = screen.getByRole('button', { name: 'Before' });
    expect(beforeButton).toHaveClass('text-[var(--color-accent)]');
    
    // Fast-forward 3 seconds
    jest.advanceTimersByTime(3000);
    
    // Should switch to new view
    await waitFor(() => {
      const afterButton = screen.getByRole('button', { name: 'After' });
      expect(afterButton).toHaveClass('text-[var(--color-accent)]');
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
    const afterButton = screen.getByRole('button', { name: 'After' });
    await user.click(afterButton);
    
    // Click Before button
    const beforeButton = screen.getByRole('button', { name: 'Before' });
    await user.click(beforeButton);
    
    expect(beforeButton).toHaveClass('text-[var(--color-accent)]');
    expect(afterButton).toHaveClass('text-[var(--color-muted)]');
  });

  it('switches view when After button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DemoContainer />);
    
    const afterButton = screen.getByRole('button', { name: 'After' });
    await user.click(afterButton);
    
    expect(afterButton).toHaveClass('text-[var(--color-accent)]');
  });

  it('pauses auto-switching when user clicks a view', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DemoContainer />);
    
    // Click After button
    const afterButton = screen.getByRole('button', { name: 'After' });
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
    
    expect(screen.getByText('Ready to transform your digital presence?')).toBeInTheDocument();
    expect(screen.getByText('Get Your Free Consultation')).toBeInTheDocument();
  });

  it('shows side-by-side view on desktop', () => {
    render(<DemoContainer />);
    
    // Check for desktop grid layout by looking for the specific grid container
    const gridContainers = document.querySelectorAll('.hidden.lg\\:grid.grid-cols-2');
    expect(gridContainers.length).toBeGreaterThan(0);
  });

  it('shows single view with transition on mobile', () => {
    render(<DemoContainer />);
    
    // Check for mobile container - look for the specific mobile view container
    const mobileContainers = document.querySelectorAll('.lg\\:hidden.relative.rounded-lg');
    expect(mobileContainers.length).toBeGreaterThan(0);
  });

  it('handles view click on desktop layout', async () => {
    render(<DemoContainer />);
    
    // Find the desktop old site view container
    const desktopViews = document.querySelectorAll('.hidden.lg\\:grid > div');
    const oldSiteContainer = desktopViews[0];
    
    // Initially old view should be active (scaled)
    expect(oldSiteContainer).toHaveClass('scale-[1.02]');
    
    // Click on new site view
    const newSiteContainer = desktopViews[1];
    fireEvent.click(newSiteContainer);
    
    await waitFor(() => {
      expect(newSiteContainer).toHaveClass('scale-[1.02]');
      expect(oldSiteContainer).toHaveClass('opacity-50');
    });
  });

  it('applies correct labels to views', () => {
    render(<DemoContainer />);
    
    // Check for Before/After labels
    const beforeLabels = screen.getAllByText('Before');
    expect(beforeLabels.length).toBeGreaterThan(0);
    
    const afterLabels = screen.getAllByText('After');
    expect(afterLabels.length).toBeGreaterThan(0);
  });
});