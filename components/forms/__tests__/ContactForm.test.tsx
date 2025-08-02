import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays validation errors for required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // Submit form without filling required fields
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    // Fill all required fields with invalid email
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    const emailInput = screen.getByLabelText(/email/i);
    
    // Clear the type and set invalid email
    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Trigger form submission
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates name length', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'A');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('validates message length', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const messageInput = screen.getByLabelText(/message/i);
    await user.type(messageInput, 'Short');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Success', id: 'test-id' }),
    });
    
    render(<ContactForm onSuccess={mockOnSuccess} />);
    
    // Fill in form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/company/i), 'Test Company');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message for the contact form');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          company: 'Test Company',
          message: 'This is a test message for the contact form',
        }),
      });
      
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles rate limit error', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many requests' }),
    });
    
    render(<ContactForm />);
    
    // Fill in form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
    });
  });

  it('handles network error', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<ContactForm />);
    
    // Fill in form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('disables form while submitting', async () => {
    const user = userEvent.setup();
    
    // Mock a slow response
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 100))
    );
    
    render(<ContactForm />);
    
    // Fill in form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    // Check that form is disabled
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
    expect(screen.getByLabelText(/message/i)).toBeDisabled();
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    
    render(<ContactForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    // Fill in form fields
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });
});