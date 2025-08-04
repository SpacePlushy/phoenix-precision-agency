import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpPage from '../page';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  SignUp: ({ afterSignUpUrl, appearance }: any) => (
    <div 
      data-testid="sign-up-component" 
      data-after-sign-up-url={afterSignUpUrl}
      data-appearance={JSON.stringify(appearance)}
    >
      Mock Clerk Sign Up
    </div>
  ),
}));

describe('SignUpPage', () => {
  it('renders the sign-up page with correct layout', () => {
    render(<SignUpPage />);

    // Check page title
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Create your account to transform your business')).toBeInTheDocument();
  });

  it('renders SignUp component with correct props', () => {
    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('sign-up-component');
    expect(signUpComponent).toBeInTheDocument();
    expect(signUpComponent).toHaveAttribute('data-after-sign-up-url', '/dashboard');
  });

  it('applies correct styling classes', () => {
    render(<SignUpPage />);

    // Check container styling
    const container = screen.getByText('Get Started').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('min-h-screen', 'bg-background', 'flex', 'items-center', 'justify-center');

    // Check max width container
    const maxWidthContainer = screen.getByText('Get Started').closest('div')?.parentElement;
    expect(maxWidthContainer).toHaveClass('w-full', 'max-w-md');

    // Check title styling
    const title = screen.getByText('Get Started');
    expect(title).toHaveClass('text-3xl', 'font-bold', 'text-foreground', 'mb-2');

    // Check subtitle styling
    const subtitle = screen.getByText('Create your account to transform your business');
    expect(subtitle).toHaveClass('text-muted-foreground');
  });

  it('configures SignUp component appearance correctly', () => {
    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('sign-up-component');
    const appearance = JSON.parse(signUpComponent.getAttribute('data-appearance') || '{}');

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
    render(<SignUpPage />);

    const container = screen.getByText('Get Started').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('px-4', 'py-12');
  });

  it('centers content properly', () => {
    render(<SignUpPage />);

    const textContainer = screen.getByText('Get Started').parentElement;
    expect(textContainer).toHaveClass('text-center', 'mb-8');
  });

  it('uses marketing-focused copy for sign up', () => {
    render(<SignUpPage />);

    // Verify the copy is appropriate for conversion
    expect(screen.getByText('Create your account to transform your business')).toBeInTheDocument();
  });

  it('uses correct theme variables in appearance', () => {
    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('sign-up-component');
    const appearance = JSON.parse(signUpComponent.getAttribute('data-appearance') || '{}');

    // Verify all CSS variables are properly referenced
    expect(appearance.variables.colorBackground).toBe('hsl(var(--card))');
    expect(appearance.variables.colorText).toBe('hsl(var(--foreground))');
    expect(appearance.variables.colorTextSecondary).toBe('hsl(var(--muted-foreground))');
    expect(appearance.variables.colorDanger).toBe('hsl(var(--destructive))');
    expect(appearance.variables.colorSuccess).toBe('#10b981');
    expect(appearance.variables.colorInputBackground).toBe('hsl(var(--background))');
    expect(appearance.variables.colorInputText).toBe('hsl(var(--foreground))');
  });

  it('shares consistent appearance with sign-in page', () => {
    render(<SignUpPage />);

    const signUpComponent = screen.getByTestId('sign-up-component');
    const appearance = JSON.parse(signUpComponent.getAttribute('data-appearance') || '{}');

    // These should match the sign-in page for consistency
    expect(appearance.elements.card).toBe('bg-card border border-border shadow-lg');
    expect(appearance.elements.socialButtonsBlockButton).toBe('bg-muted text-foreground border-border hover:bg-muted/80 transition-colors');
    expect(appearance.elements.formFieldInput).toBe('bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent');
  });
});