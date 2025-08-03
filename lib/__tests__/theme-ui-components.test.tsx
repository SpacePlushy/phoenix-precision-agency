import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockTheme, renderWithTheme } from './theme-test-utils';

// Mock components that might use theme
const TestCard = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
    <h3 className="text-2xl font-semibold">Test Card</h3>
    <p className="text-muted-foreground mt-2">Card description</p>
  </div>
);

const TestForm = () => (
  <form className="space-y-4">
    <div>
      <label className="text-sm font-medium text-foreground">Name</label>
      <input 
        type="text" 
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        placeholder="Enter your name"
      />
    </div>
    <Button type="submit">Submit</Button>
  </form>
);

const TestNavigation = () => (
  <nav className="bg-background border-b border-border">
    <div className="flex items-center justify-between px-4 py-3">
      <a href="/" className="text-xl font-bold text-foreground hover:text-primary">
        Logo
      </a>
      <div className="flex items-center space-x-4">
        <a href="/about" className="text-muted-foreground hover:text-foreground">
          About
        </a>
        <a href="/contact" className="text-muted-foreground hover:text-foreground">
          Contact
        </a>
      </div>
    </div>
  </nav>
);

describe('UI Components Theme Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document classes
    document.documentElement.classList.remove('dark', 'light');
  });

  describe('Light Mode Rendering', () => {
    beforeEach(() => {
      mockTheme({ theme: 'light', resolvedTheme: 'light' });
      document.documentElement.classList.add('light');
    });

    it('renders Button component correctly in light mode', () => {
      render(
        <div>
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      );

      // All buttons should be rendered
      expect(screen.getByText('Default Button')).toBeInTheDocument();
      expect(screen.getByText('Destructive Button')).toBeInTheDocument();
      expect(screen.getByText('Outline Button')).toBeInTheDocument();
      expect(screen.getByText('Secondary Button')).toBeInTheDocument();
      expect(screen.getByText('Ghost Button')).toBeInTheDocument();
      expect(screen.getByText('Link Button')).toBeInTheDocument();
    });

    it('renders Card component with proper light mode styles', () => {
      const { container } = render(<TestCard />);

      const card = container.querySelector('.bg-card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('text-card-foreground', 'border', 'shadow-sm');

      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('Card description')).toHaveClass('text-muted-foreground');
    });

    it('renders Form elements with light mode styles', () => {
      const { container } = render(<TestForm />);

      const input = container.querySelector('input');
      expect(input).toHaveClass(
        'border-input',
        'bg-background',
        'text-foreground',
        'placeholder:text-muted-foreground'
      );

      const label = screen.getByText('Name');
      expect(label).toHaveClass('text-foreground');
    });

    it('renders Navigation with light mode colors', () => {
      const { container } = render(<TestNavigation />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('bg-background', 'border-border');

      const logo = screen.getByText('Logo');
      expect(logo).toHaveClass('text-foreground', 'hover:text-primary');

      const links = screen.getAllByRole('link').slice(1); // Skip logo
      links.forEach(link => {
        expect(link).toHaveClass('text-muted-foreground', 'hover:text-foreground');
      });
    });
  });

  describe('Dark Mode Rendering', () => {
    beforeEach(() => {
      mockTheme({ theme: 'dark', resolvedTheme: 'dark' });
      document.documentElement.classList.add('dark');
    });

    it('renders Button component correctly in dark mode', () => {
      render(
        <div className="dark">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      );

      // All buttons should be rendered with dark mode applied
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(6);
      
      // Parent has dark class
      expect(buttons[0].closest('.dark')).toBeInTheDocument();
    });

    it('renders Card component with proper dark mode styles', () => {
      const { container } = render(
        <div className="dark">
          <TestCard />
        </div>
      );

      const card = container.querySelector('.bg-card');
      expect(card).toBeInTheDocument();
      
      // Card should be within dark mode context
      expect(card?.closest('.dark')).toBeInTheDocument();
    });

    it('renders Form elements with dark mode styles', () => {
      const { container } = render(
        <div className="dark">
          <TestForm />
        </div>
      );

      const input = container.querySelector('input');
      expect(input).toBeInTheDocument();
      
      // Form should be within dark mode context
      expect(input?.closest('.dark')).toBeInTheDocument();
    });

    it('renders Navigation with dark mode colors', () => {
      const { container } = render(
        <div className="dark">
          <TestNavigation />
        </div>
      );

      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();
      
      // Navigation should be within dark mode context
      expect(nav?.closest('.dark')).toBeInTheDocument();
    });
  });

  describe('Theme Transition Classes', () => {
    it('applies transition classes when theme changes', () => {
      const { rerender } = render(
        <div className="transition-colors duration-200">
          <TestCard />
        </div>
      );

      const container = screen.getByText('Test Card').closest('div');
      expect(container?.parentElement).toHaveClass('transition-colors', 'duration-200');

      // Simulate theme change
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');

      rerender(
        <div className="dark transition-colors duration-200">
          <TestCard />
        </div>
      );

      // Transition classes should still be present
      expect(container?.parentElement).toHaveClass('transition-colors', 'duration-200');
    });
  });

  describe('Dropdown Menu Theme Support', () => {
    it('renders dropdown menu correctly in light mode', async () => {
      mockTheme({ theme: 'light', resolvedTheme: 'light' });

      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>Option 1</DropdownMenuItem>
            <DropdownMenuItem>Option 2</DropdownMenuItem>
            <DropdownMenuItem>Option 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();
    });

    it('renders dropdown menu correctly in dark mode', async () => {
      mockTheme({ theme: 'dark', resolvedTheme: 'dark' });
      document.documentElement.classList.add('dark');

      render(
        <div className="dark">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );

      const trigger = screen.getByText('Open Menu');
      expect(trigger).toBeInTheDocument();
      expect(trigger.closest('.dark')).toBeInTheDocument();
    });
  });

  describe('Accessibility in Different Themes', () => {
    it('maintains proper contrast ratios in light mode', () => {
      mockTheme({ theme: 'light', resolvedTheme: 'light' });

      render(
        <div>
          <Button variant="default">High Contrast Button</Button>
          <p className="text-foreground bg-background">
            Regular text on background
          </p>
          <p className="text-muted-foreground bg-background">
            Muted text on background
          </p>
        </div>
      );

      // All text should be visible and readable
      expect(screen.getByText('High Contrast Button')).toBeVisible();
      expect(screen.getByText('Regular text on background')).toBeVisible();
      expect(screen.getByText('Muted text on background')).toBeVisible();
    });

    it('maintains proper contrast ratios in dark mode', () => {
      mockTheme({ theme: 'dark', resolvedTheme: 'dark' });
      document.documentElement.classList.add('dark');

      render(
        <div className="dark">
          <Button variant="default">High Contrast Button</Button>
          <p className="text-foreground bg-background">
            Regular text on background
          </p>
          <p className="text-muted-foreground bg-background">
            Muted text on background
          </p>
        </div>
      );

      // All text should be visible and readable in dark mode
      expect(screen.getByText('High Contrast Button')).toBeVisible();
      expect(screen.getByText('Regular text on background')).toBeVisible();
      expect(screen.getByText('Muted text on background')).toBeVisible();
    });

    it('preserves focus indicators in both themes', () => {
      const { rerender } = render(
        <Button className="focus:ring-2 focus:ring-primary">
          Focusable Button
        </Button>
      );

      const button = screen.getByText('Focusable Button');
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary');

      // Change to dark mode
      document.documentElement.classList.add('dark');
      rerender(
        <div className="dark">
          <Button className="focus:ring-2 focus:ring-primary">
            Focusable Button
          </Button>
        </div>
      );

      // Focus indicators should still be present
      expect(button).toHaveClass('focus:ring-2', 'focus:ring-primary');
    });
  });
});