import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../theme-toggle';
import { mockTheme, renderWithTheme } from '@/lib/__tests__/theme-test-utils';

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the toggle button with correct aria-label', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });

  it('shows sun icon in light mode', () => {
    mockTheme({ theme: 'light', resolvedTheme: 'light' });
    
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    const sunIcon = button.querySelector('.rotate-0.scale-100');
    const moonIcon = button.querySelector('.rotate-90.scale-0');
    
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  it('shows moon icon in dark mode', () => {
    mockTheme({ theme: 'dark', resolvedTheme: 'dark' });
    
    // Mock dark mode class
    document.documentElement.classList.add('dark');
    
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    const sunIcon = button.querySelector('.dark\\:-rotate-90.dark\\:scale-0');
    const moonIcon = button.querySelector('.dark\\:rotate-0.dark\\:scale-100');
    
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    
    // Cleanup
    document.documentElement.classList.remove('dark');
  });

  it('opens dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    // Initially dropdown should not be visible
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    
    // Click to open dropdown
    await user.click(button);
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    
    // Check all theme options are present
    expect(screen.getByRole('menuitem', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /system/i })).toBeInTheDocument();
  });

  it('switches to light theme when light option is clicked', async () => {
    const { mockSetTheme } = mockTheme();
    const user = userEvent.setup();
    
    render(<ThemeToggle />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Click light theme option
    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    await user.click(lightOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('switches to dark theme when dark option is clicked', async () => {
    const { mockSetTheme } = mockTheme();
    const user = userEvent.setup();
    
    render(<ThemeToggle />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Click dark theme option
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    await user.click(darkOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('switches to system theme when system option is clicked', async () => {
    const { mockSetTheme } = mockTheme();
    const user = userEvent.setup();
    
    render(<ThemeToggle />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Click system theme option
    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    await user.click(systemOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('closes dropdown after selecting a theme', async () => {
    const { mockSetTheme } = mockTheme();
    const user = userEvent.setup();
    
    render(<ThemeToggle />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Verify dropdown is open
    expect(screen.getByRole('menu')).toBeInTheDocument();
    
    // Click a theme option
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    await user.click(darkOption);
    
    // Verify dropdown is closed
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('renders correct icons for each theme option', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);
    
    // Check icons are present
    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    
    expect(lightOption.querySelector('svg')).toBeInTheDocument();
    expect(darkOption.querySelector('svg')).toBeInTheDocument();
    expect(systemOption.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    expect(button).toHaveClass('h-9', 'w-9', 'hover:bg-muted');
  });

  it('handles keyboard navigation', async () => {
    const { mockSetTheme } = mockTheme();
    const user = userEvent.setup();
    
    render(<ThemeToggle />);
    
    // Tab to button and open with Enter
    await user.tab();
    await user.keyboard('{Enter}');
    
    // Verify dropdown is open
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
    
    // Navigate with arrow keys
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    
    // Verify theme was changed
    expect(mockSetTheme).toHaveBeenCalled();
  });

  it('includes screen reader text', () => {
    render(<ThemeToggle />);
    
    const srText = screen.getByText('Toggle theme');
    expect(srText).toBeInTheDocument();
    expect(srText).toHaveClass('sr-only');
  });
});