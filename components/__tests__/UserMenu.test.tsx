import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserMenu from '../UserMenu';
import { useUser } from '@clerk/nextjs';

// Mock @clerk/nextjs
jest.mock('@clerk/nextjs', () => ({
  useUser: jest.fn(),
  UserButton: ({ children, afterSignOutUrl, appearance, userProfileProps }: any) => {
    const MenuItems = ({ children }: any) => <div data-testid="user-button-menu">{children}</div>;
    const Link = ({ label, labelIcon, href }: any) => (
      <a href={href} data-testid={`user-button-link-${label}`}>
        {labelIcon}
        {label}
      </a>
    );
    const Action = ({ label }: any) => (
      <button data-testid={`user-button-action-${label}`}>{label}</button>
    );
    
    return (
      <div data-testid="user-button" data-after-sign-out-url={afterSignOutUrl}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === MenuItems) {
            return child;
          }
          return null;
        })}
      </div>
    );
  },
}));

// Add UserButton sub-components to the mock
const MockUserButton = (jest.requireMock('@clerk/nextjs') as any).UserButton;
MockUserButton.MenuItems = ({ children }: any) => <div data-testid="user-button-menu">{children}</div>;
MockUserButton.Link = ({ label, labelIcon, href }: any) => (
  <a href={href} data-testid={`user-button-link-${label}`}>
    {labelIcon}
    {label}
  </a>
);
MockUserButton.Action = ({ label }: any) => (
  <button data-testid={`user-button-action-${label}`}>{label}</button>
);

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('shows skeleton loader when user data is loading', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: false,
        user: null,
      });

      render(<UserMenu />);

      const skeleton = screen.getByRole('status');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('h-10', 'w-10', 'rounded-full');
    });
  });

  describe('Unauthenticated State', () => {
    it('returns null when user is not signed in', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: null,
      });

      const { container } = render(<UserMenu />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Authenticated State', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      primaryEmailAddress: {
        emailAddress: 'john@example.com',
      },
    };

    it('displays user information when authenticated', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      });

      render(<UserMenu />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('displays username when firstName is not available', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          ...mockUser,
          firstName: null,
        },
      });

      render(<UserMenu />);

      expect(screen.getByText('johndoe')).toBeInTheDocument();
    });

    it('displays "User" when no name is available', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          ...mockUser,
          firstName: null,
          username: null,
        },
      });

      render(<UserMenu />);

      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('renders UserButton with correct props', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      });

      render(<UserMenu />);

      const userButton = screen.getByTestId('user-button');
      expect(userButton).toBeInTheDocument();
      expect(userButton).toHaveAttribute('data-after-sign-out-url', '/');
    });

    it('includes dashboard link in UserButton menu', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      });

      render(<UserMenu />);

      const dashboardLink = screen.getByTestId('user-button-link-Dashboard');
      expect(dashboardLink).toBeInTheDocument();
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    it('includes manage account and sign out actions', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: mockUser,
      });

      render(<UserMenu />);

      expect(screen.getByTestId('user-button-action-manageAccount')).toBeInTheDocument();
      expect(screen.getByTestId('user-button-action-signOut')).toBeInTheDocument();
    });

    it('handles missing email gracefully', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          ...mockUser,
          primaryEmailAddress: null,
        },
      });

      render(<UserMenu />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.queryByText('john@example.com')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('hides user details on small screens', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'John',
          primaryEmailAddress: {
            emailAddress: 'john@example.com',
          },
        },
      });

      render(<UserMenu />);

      const userDetails = screen.getByText('John').parentElement;
      expect(userDetails).toHaveClass('hidden', 'sm:block');
    });
  });

  describe('Styling and Theming', () => {
    it('applies correct text styles', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'John',
          primaryEmailAddress: {
            emailAddress: 'john@example.com',
          },
        },
      });

      render(<UserMenu />);

      const userName = screen.getByText('John');
      expect(userName).toHaveClass('text-sm', 'font-medium', 'text-foreground');

      const userEmail = screen.getByText('john@example.com');
      expect(userEmail).toHaveClass('text-xs', 'text-muted-foreground');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid loading state changes', async () => {
      const { rerender } = render(<UserMenu />);

      // Start with loading
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: false,
        user: null,
      });
      rerender(<UserMenu />);
      expect(screen.getByRole('status')).toBeInTheDocument();

      // Change to loaded with user
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'John',
          primaryEmailAddress: {
            emailAddress: 'john@example.com',
          },
        },
      });
      rerender(<UserMenu />);

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
      });
    });

    it('handles very long names and emails', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'VeryLongFirstNameThatMightOverflowTheContainer',
          primaryEmailAddress: {
            emailAddress: 'verylongemailaddressthatmightcauselayoutissues@exampledomainthatisalsoverylongfortest.com',
          },
        },
      });

      render(<UserMenu />);

      expect(screen.getByText('VeryLongFirstNameThatMightOverflowTheContainer')).toBeInTheDocument();
      expect(screen.getByText('verylongemailaddressthatmightcauselayoutissues@exampledomainthatisalsoverylongfortest.com')).toBeInTheDocument();
    });

    it('handles special characters in user data', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'John <script>alert("XSS")</script>',
          username: 'john&doe',
          primaryEmailAddress: {
            emailAddress: 'john+test@example.com',
          },
        },
      });

      render(<UserMenu />);

      // React automatically escapes these, so they should render as text
      expect(screen.getByText('John <script>alert("XSS")</script>')).toBeInTheDocument();
      expect(screen.getByText('john+test@example.com')).toBeInTheDocument();
    });
  });

  describe('Integration with Clerk UserButton', () => {
    it('renders dashboard icon SVG correctly', () => {
      (useUser as jest.Mock).mockReturnValue({
        isLoaded: true,
        user: {
          firstName: 'John',
          primaryEmailAddress: {
            emailAddress: 'john@example.com',
          },
        },
      });

      render(<UserMenu />);

      // Check if the dashboard link has an icon
      const dashboardLink = screen.getByTestId('user-button-link-Dashboard');
      const svg = dashboardLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '16');
      expect(svg).toHaveAttribute('height', '16');
    });
  });
});