import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggleWithPersistence } from '../theme-toggle-with-persistence';
import { mockTheme } from '@/lib/__tests__/theme-test-utils';

// Mock fetch globally
global.fetch = jest.fn();

describe('ThemeToggleWithPersistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic functionality', () => {
    it('renders the toggle button with correct aria-label', () => {
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    });

    it('opens dropdown menu when clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      
      expect(screen.getByRole('menuitem', { name: /light/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: /system/i })).toBeInTheDocument();
    });
  });

  describe('Theme persistence', () => {
    it('persists theme change to API when light theme is selected', async () => {
      const { mockSetTheme } = mockTheme();
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const lightOption = screen.getByRole('menuitem', { name: /light/i });
      await user.click(lightOption);
      
      // Verify theme was set locally
      expect(mockSetTheme).toHaveBeenCalledWith('light');
      
      // Verify API call was made
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme: 'light' }),
        });
      });
    });

    it('persists theme change to API when dark theme is selected', async () => {
      const { mockSetTheme } = mockTheme();
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme: 'dark' }),
        });
      });
    });

    it('persists theme change to API when system theme is selected', async () => {
      const { mockSetTheme } = mockTheme();
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const systemOption = screen.getByRole('menuitem', { name: /system/i });
      await user.click(systemOption);
      
      expect(mockSetTheme).toHaveBeenCalledWith('system');
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ theme: 'system' }),
        });
      });
    });

    it('handles API persistence failure gracefully', async () => {
      const { mockSetTheme } = mockTheme();
      const user = userEvent.setup();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);
      
      // Theme should still be set locally even if API fails
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      // Error should be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to persist theme preference:',
          expect.any(Error)
        );
      });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Initial preferences loading', () => {
    it('fetches user preferences on mount', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'dark' }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences');
      });
    });

    it('applies fetched theme preference if different from current', async () => {
      const { mockSetTheme } = mockTheme({ theme: 'light' });
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'dark' }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      await waitFor(() => {
        expect(mockSetTheme).toHaveBeenCalledWith('dark');
      });
    });

    it('does not change theme if fetched preference matches current', async () => {
      const { mockSetTheme } = mockTheme({ theme: 'dark' });
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'dark' }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences');
      });
      
      // setTheme should not be called if theme is already the same
      expect(mockSetTheme).not.toHaveBeenCalled();
    });

    it('handles preference fetch failure gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      render(<ThemeToggleWithPersistence />);
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch theme preference:',
          expect.any(Error)
        );
      });
      
      consoleErrorSpy.mockRestore();
    });

    it('handles non-ok response when fetching preferences', async () => {
      const { mockSetTheme } = mockTheme();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });
      
      render(<ThemeToggleWithPersistence />);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/user/preferences');
      });
      
      // Should not try to set theme if response is not ok
      expect(mockSetTheme).not.toHaveBeenCalled();
    });
  });

  describe('Integration behavior', () => {
    it('closes dropdown after theme selection and API call', async () => {
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      expect(screen.getByRole('menu')).toBeInTheDocument();
      
      const lightOption = screen.getByRole('menuitem', { name: /light/i });
      await user.click(lightOption);
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('handles rapid theme changes', async () => {
      const { mockSetTheme } = mockTheme();
      const user = userEvent.setup();
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      
      render(<ThemeToggleWithPersistence />);
      
      // First change
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      const lightOption = screen.getByRole('menuitem', { name: /light/i });
      await user.click(lightOption);
      
      // Second change immediately after
      await user.click(button);
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);
      
      // Both changes should be registered
      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      // Both API calls should be made
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3); // 1 initial fetch + 2 updates
      });
    });
  });
});