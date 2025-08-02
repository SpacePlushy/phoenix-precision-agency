'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

// Form data type that matches the Lead interface in types.ts
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle rate limit error
        if (response.status === 429) {
          setSubmitStatus({
            type: 'error',
            message: 'Too many requests. Please try again later.',
          });
        } else {
          setSubmitStatus({
            type: 'error',
            message: result.error || 'Something went wrong. Please try again.',
          });
        }
        return;
      }

      // Success
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for contacting us! We\'ll get back to you soon.',
      });
      reset();
      onSuccess?.();
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name *
        </label>
        <input
          {...register('name', {
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            maxLength: {
              value: 100,
              message: 'Name must be less than 100 characters',
            },
          })}
          type="text"
          id="name"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
            errors.name ? 'border-error' : 'border-border'
          }`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email *
        </label>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          type="email"
          id="email"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
            errors.email ? 'border-error' : 'border-border'
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-error">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field (Optional) */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
          Phone
        </label>
        <input
          {...register('phone', {
            pattern: {
              value: /^[\d\s\-\+\(\)]+$/,
              message: 'Invalid phone number',
            },
          })}
          type="tel"
          id="phone"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
            errors.phone ? 'border-error' : 'border-border'
          }`}
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
        )}
      </div>

      {/* Company Field (Optional) */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
          Company
        </label>
        <input
          {...register('company', {
            maxLength: {
              value: 100,
              message: 'Company name must be less than 100 characters',
            },
          })}
          type="text"
          id="company"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors ${
            errors.company ? 'border-error' : 'border-border'
          }`}
          disabled={isSubmitting}
        />
        {errors.company && (
          <p className="mt-1 text-sm text-error">{errors.company.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message *
        </label>
        <textarea
          {...register('message', {
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters',
            },
            maxLength: {
              value: 1000,
              message: 'Message must be less than 1000 characters',
            },
          })}
          id="message"
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors resize-none ${
            errors.message ? 'border-error' : 'border-border'
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-error">{errors.message.message}</p>
        )}
      </div>

      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className={`p-4 rounded-lg ${
            submitStatus.type === 'success'
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-error/10 text-error border border-error/20'
          }`}
          role="alert"
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
          isSubmitting
            ? 'bg-muted text-foreground/50 cursor-not-allowed'
            : 'bg-accent text-white hover:bg-accent/90 active:scale-[0.98]'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Submitting...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

// Usage example in comments:
/*
import ContactForm from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <ContactForm onSuccess={() => console.log('Form submitted successfully!')} />
    </div>
  );
}
*/