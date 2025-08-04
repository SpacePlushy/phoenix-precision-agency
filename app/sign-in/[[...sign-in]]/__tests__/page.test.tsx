import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignInPage from '../page';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  SignIn: ({ afterSignInUrl, appearance }: any) => (
    <div 
      data-testid="sign-in-component" 
      data-after-sign-in-url={afterSignInUrl}
      data-appearance={JSON.stringify(appearance)}
    >
      Mock Clerk Sign In
    </div>
  ),
}));

describe('SignInPage', () => {
  it('renders the sign-in page with correct layout', () => {
    render(<SignInPage />);

    // Check page title
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument();
  });

  it('renders SignIn component with correct props', () => {
    render(<SignInPage />);

    const signInComponent = screen.getByTestId('sign-in-component');
    expect(signInComponent).toBeInTheDocument();
    expect(signInComponent).toHaveAttribute('data-after-sign-in-url', '/dashboard');
  });

  it('applies correct styling classes', () => {
    render(<SignInPage />);

    // Check container styling
    const container = screen.getByText('Welcome Back').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center');

    // Check max width container
    const maxWidthContainer = screen.getByText('Welcome Back').closest('div')?.parentElement;
    expect(maxWidthContainer).toHaveClass('w-full', 'max-w-md');

    // Check title styling
    const title = screen.getByText('Welcome Back');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-foreground', 'mb-2');

    // Check subtitle styling
    const subtitle = screen.getByText('Sign in to access your dashboard');
    expect(subtitle).toHaveClass('text-muted-foreground');
  });

  it('configures SignIn component appearance correctly', () => {
    render(<SignInPage />);

    const signInComponent = screen.getByTestId('sign-in-component');
    const appearance = JSON.parse(signInComponent.getAttribute('data-appearance') || '{}');

    // Check key appearance elements
    expect(appearance.elements.formButtonPrimary).toContain('bg-primary');
    expect(appearance.elements.card).toContain('bg-card');
    expect(appearance.elements.formFieldInput).toContain('bg-background');
    expect(appearance.elements.footerActionLink).toContain('text-accent');

    // Check layout configuration
    expect(appearance.layout.socialButtonsPlacement).toBe('bottom');
    expect(appearance.layout.socialButtonsVariant).toBe('blockButton');

    // Check variables
    expect(appearance.variables.colorPrimary).toBe('hsl(var(--primary))');
    expect(appearance.variables.borderRadius).toBe('0.5rem');
  });

  it('has responsive padding', () => {
    render(<SignInPage />);

    const container = screen.getByText('Welcome Back').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('px-4', 'py-12');
  });

  it('centers content properly', () => {
    render(<SignInPage />);

    const textContainer = screen.getByText('Welcome Back').parentElement;
    expect(textContainer).toHaveClass('text-center', 'mb-8');
  });

  it('uses correct theme variables in appearance', () => {
    render(<SignInPage />);

    const signInComponent = screen.getByTestId('sign-in-component');
    const appearance = JSON.parse(signInComponent.getAttribute('data-appearance') || '{}');

    // Verify all CSS variables are properly referenced
    expect(appearance.variables.colorBackground).toBe('hsl(var(--card))');
    expect(appearance.variables.colorText).toBe('hsl(var(--foreground))');
    expect(appearance.variables.colorTextSecondary).toBe('hsl(var(--muted-foreground))');
    expect(appearance.variables.colorDanger).toBe('hsl(var(--destructive))');
    expect(appearance.variables.colorSuccess).toBe('#10b981');
    expect(appearance.variables.colorInputBackground).toBe('hsl(var(--background))');
    expect(appearance.variables.colorInputText).toBe('hsl(var(--foreground))');
  });

  it('configures all form field appearances', () => {
    render(<SignInPage />);

    const signInComponent = screen.getByTestId('sign-in-component');
    const appearance = JSON.parse(signInComponent.getAttribute('data-appearance') || '{}');

    // Check all form-related appearance settings
    expect(appearance.elements.formFieldLabel).toBe('text-foreground');
    expect(appearance.elements.formFieldError).toBe('text-destructive');
    expect(appearance.elements.formFieldSuccessText).toBe('text-green-500');
    expect(appearance.elements.otpCodeFieldInput).toBe('border-input text-foreground');
    expect(appearance.elements.formResendCodeLink).toBe('text-accent hover:text-accent/80');
  });
});