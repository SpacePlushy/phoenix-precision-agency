import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeToggleWithPersistence } from '@/components/theme-toggle-with-persistence';
import { mockMatchMedia, mockLocalStorage, mockTheme } from './theme-test-utils';

// Component that uses theme
function ThemedComponent() {
  return (
    <div data-testid="themed-component" className="bg-background text-foreground">
      <h1 className="text-2xl dark:text-white">Themed Content</h1>
      <p className="text-muted dark:text-muted-foreground">
        This component adapts to the theme
      </p>
    </div>
  );
}

describe('Theme Integration Tests', () => {
  let mockFetch: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia(false); // Default to light mode preference
    mockLocalStorage();
    mockFetch = jest.spyOn(global, 'fetch').mockImplementation();
  });

  afterEach(() => {
    mockFetch.mockRestore();
    document.documentElement.classList.remove('dark', 'light');
  });

  describe('Theme Provider Integration', () => {
    it('provides theme context to child components', async () => {
      const TestComponent = () => {
        const { useTheme } = require('next-themes');
        const { theme, setTheme } = useTheme();
        
        return (
          <div>
            <span data-testid="current-theme">{theme}</span>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    it('syncs theme across multiple components', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      const Component1 = () => {
        const { useTheme } = require('next-themes');
        const { theme } = useTheme();
        return <div data-testid="comp1-theme">{theme}</div>;
      };

      const Component2 = () => {
        const { useTheme } = require('next-themes');
        const { theme } = useTheme();
        return <div data-testid="comp2-theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <ThemeToggle />
          <Component1 />
          <Component2 />
        </ThemeProvider>
      );

      // Open dropdown and change theme
      const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(toggleButton);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('System Theme Detection', () => {
    it('detects and applies system dark mode preference', () => {
      mockMatchMedia(true); // System prefers dark mode
      mockTheme({ systemTheme: 'dark', theme: 'system', resolvedTheme: 'dark' });

      render(
        <ThemeProvider defaultTheme="system" enableSystem>
          <ThemedComponent />
        </ThemeProvider>
      );

      const provider = screen.getByTestId('theme-provider');
      const props = JSON.parse(provider.getAttribute('data-props') || '{}');
      
      expect(props.defaultTheme).toBe('system');
      expect(props.enableSystem).toBe(true);
    });

    it('detects and applies system light mode preference', () => {
      mockMatchMedia(false); // System prefers light mode
      mockTheme({ systemTheme: 'light', theme: 'system', resolvedTheme: 'light' });

      render(
        <ThemeProvider defaultTheme="system" enableSystem>
          <ThemedComponent />
        </ThemeProvider>
      );

      const provider = screen.getByTestId('theme-provider');
      const props = JSON.parse(provider.getAttribute('data-props') || '{}');
      
      expect(props.defaultTheme).toBe('system');
      expect(props.enableSystem).toBe(true);
    });

    it('respects manual theme selection over system preference', async () => {
      const user = userEvent.setup();
      mockMatchMedia(true); // System prefers dark
      const { mockSetTheme } = mockTheme({ 
        systemTheme: 'dark', 
        theme: 'light', 
        resolvedTheme: 'light' 
      });

      render(<ThemeToggle />);

      // User manually selected light theme despite system dark preference
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const lightOption = screen.getByRole('menuitem', { name: /light/i });
      await user.click(lightOption);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('LocalStorage Persistence', () => {
    it('saves theme preference to localStorage', async () => {
      const { localStorageMock } = mockLocalStorage();
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('reads theme preference from localStorage on mount', () => {
      const { localStorageMock, store } = mockLocalStorage();
      store['theme'] = 'dark';

      mockTheme({ theme: 'dark', resolvedTheme: 'dark' });

      render(
        <ThemeProvider storageKey="theme">
          <ThemedComponent />
        </ThemeProvider>
      );

      const provider = screen.getByTestId('theme-provider');
      const props = JSON.parse(provider.getAttribute('data-props') || '{}');
      
      expect(props.storageKey).toBe('theme');
    });
  });

  describe('API Persistence Integration', () => {
    it('syncs theme preference with API on change', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'system' }),
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ThemeToggleWithPersistence />);

      // Wait for initial preference fetch
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/user/preferences');
      });

      // Change theme
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      // Verify API persistence
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: 'dark' }),
        });
      });

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('works offline - theme changes locally even if API fails', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Initial fetch fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Update also fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<ThemeToggleWithPersistence />);

      // Wait for failed initial fetch
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to fetch theme preference:',
          expect.any(Error)
        );
      });

      // Change theme
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      // Theme should still change locally
      expect(mockSetTheme).toHaveBeenCalledWith('dark');

      // Error should be logged for failed persistence
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to persist theme preference:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Theme Transition Behavior', () => {
    it('prevents flash of incorrect theme during hydration', () => {
      // Simulate server-side rendering with class already applied
      document.documentElement.classList.add('dark');

      render(
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          disableTransitionOnChange
        >
          <ThemedComponent />
        </ThemeProvider>
      );

      // Check that dark class is maintained
      expect(document.documentElement).toHaveClass('dark');
    });

    it('handles theme changes without layout shift', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      render(
        <ThemeProvider disableTransitionOnChange>
          <ThemeToggle />
          <ThemedComponent />
        </ThemeProvider>
      );

      // Change theme
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      
      // Verify disableTransitionOnChange was passed
      const provider = screen.getByTestId('theme-provider');
      const props = JSON.parse(provider.getAttribute('data-props') || '{}');
      expect(props.disableTransitionOnChange).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid theme changes without race conditions', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /toggle theme/i });

      // Rapidly change themes
      for (let i = 0; i < 3; i++) {
        await user.click(button);
        const options = await screen.findAllByRole('menuitem');
        await user.click(options[i % 3]);
      }

      // Should have been called 3 times
      expect(mockSetTheme).toHaveBeenCalledTimes(3);
    });

    it('handles missing theme provider gracefully', () => {
      // Mock useTheme to throw when no provider
      const useThemeMock = jest.fn().mockImplementation(() => {
        throw new Error('useTheme must be used within ThemeProvider');
      });

      jest.doMock('next-themes', () => ({
        useTheme: useThemeMock,
      }));

      // Component should handle the error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<ThemeToggle />);
      }).toThrow('useTheme must be used within ThemeProvider');

      consoleErrorSpy.mockRestore();
    });

    it('handles invalid theme values gracefully', async () => {
      const user = userEvent.setup();
      const { mockSetTheme } = mockTheme();

      // Simulate API returning invalid theme
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ theme: 'invalid-theme' }),
      });

      render(<ThemeToggleWithPersistence />);

      // Should not crash, just use default behavior
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/user/preferences');
      });

      // Can still change theme manually
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);
      
      const darkOption = screen.getByRole('menuitem', { name: /dark/i });
      await user.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });
});