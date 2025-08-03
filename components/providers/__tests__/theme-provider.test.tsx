import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../theme-provider';

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear any existing mocks
    jest.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
  });

  it('passes props to NextThemesProvider', () => {
    const props = {
      attribute: 'class' as const,
      defaultTheme: 'system',
      enableSystem: true,
      disableTransitionOnChange: true,
      storageKey: 'theme-preference',
    };

    render(
      <ThemeProvider {...props}>
        <div>Content</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('theme-provider');
    const passedProps = JSON.parse(provider.getAttribute('data-props') || '{}');
    
    expect(passedProps).toEqual(props);
  });

  it('renders multiple children', () => {
    render(
      <ThemeProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    const { container } = render(
      <ThemeProvider />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default theme configuration when no props provided', () => {
    render(
      <ThemeProvider>
        <div>Content</div>
      </ThemeProvider>
    );

    const provider = screen.getByTestId('theme-provider');
    const passedProps = JSON.parse(provider.getAttribute('data-props') || '{}');
    
    // Should have empty props object when no props provided
    expect(passedProps).toEqual({});
  });

  it('preserves component hierarchy', () => {
    render(
      <ThemeProvider>
        <div data-testid="parent">
          <div data-testid="nested">Nested Content</div>
        </div>
      </ThemeProvider>
    );

    const parent = screen.getByTestId('parent');
    const nested = screen.getByTestId('nested');
    
    expect(parent).toContainElement(nested);
  });
});