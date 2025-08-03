import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactPage from '@/app/(marketing)/contact/page';

// Mock fetch for component tests
global.fetch = jest.fn();

describe('Contact Form - End to End Acceptance Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full contact form submission flow', async () => {
    const user = userEvent.setup();

    // 1. Render the contact page
    render(<ContactPage />);

    // 2. Verify page elements
    expect(screen.getByRole('heading', { name: /Let's Build Something/i })).toBeInTheDocument();
    expect(screen.getByText(/Ready to transform your digital presence/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Response Time/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Business Hours/i })).toBeInTheDocument();

    // 3. Fill out the form
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const companyInput = screen.getByLabelText(/company/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, 'Jane Smith');
    await user.type(emailInput, 'jane.smith@example.com');
    await user.type(phoneInput, '+1 (555) 123-4567');
    await user.type(companyInput, 'Tech Innovations Inc.');
    await user.type(messageInput, 'I am interested in learning more about your web development services for our upcoming project.');

    // 4. Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
        id: 'lead_123456789_abc',
      }),
    });

    // 5. Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // 6. Verify loading state (may be very quick)
    await waitFor(() => {
      // Either we see the loading state or the success message
      const hasLoadingState = screen.queryByText(/submitting/i);
      const hasSuccessMessage = screen.queryByText(/thank you for contacting us/i);
      expect(hasLoadingState || hasSuccessMessage).toBeTruthy();
    });

    // 7. Verify success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
    });

    // 8. Verify form was cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(phoneInput).toHaveValue('');
    expect(companyInput).toHaveValue('');
    expect(messageInput).toHaveValue('');

    // 9. Verify API was called with correct data
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Tech Innovations Inc.',
        message: 'I am interested in learning more about your web development services for our upcoming project.',
      }),
    });
  });

  it('handles rate limiting gracefully', async () => {
    const user = userEvent.setup();

    render(<ContactPage />);

    // Fill minimal required fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');

    // Mock rate limit error
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: 'Too many requests' }),
    });

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/too many requests/i)).toBeInTheDocument();
    });

    // Form should still be filled (not cleared on error)
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
  });

  it('validates form fields before submission', async () => {
    const user = userEvent.setup();

    render(<ContactPage />);

    // Try to submit empty form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify validation errors appear
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    // API should not be called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits form data to API endpoint', async () => {
    const user = userEvent.setup();

    render(<ContactPage />);

    // Fill out the form
    await user.type(screen.getByLabelText(/name/i), 'API Test User');
    await user.type(screen.getByLabelText(/email/i), 'api.test@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/company/i), 'API Test Company');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message from the API acceptance test');

    // Mock successful API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
        id: 'lead_123456789_abc',
      }),
    });

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify success message
    await waitFor(() => {
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
    });

    // Verify API was called with correct data
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'API Test User',
        email: 'api.test@example.com',
        phone: '+1234567890',
        company: 'API Test Company',
        message: 'This is a test message from the API acceptance test',
      }),
    });
  });

  it('handles validation errors appropriately in the UI', async () => {
    const user = userEvent.setup();

    render(<ContactPage />);

    // Test email validation
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email-format');
    
    // Fill other required fields
    await user.type(screen.getByLabelText(/name/i), 'Test User');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify email validation error
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });

    // Fix email and resubmit
    await user.clear(emailInput);
    await user.type(emailInput, 'valid.email@example.com');

    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, id: 'test-id' }),
    });

    await user.click(screen.getByRole('button', { name: /send message/i }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/thank you for contacting us/i)).toBeInTheDocument();
    });
  });
});