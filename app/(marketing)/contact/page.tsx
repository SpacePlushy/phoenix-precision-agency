import ContactForm from '@/components/forms/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Phoenix Precision Agency. Contact us for professional web development, digital solutions, and business transformation services.',
  openGraph: {
    title: 'Contact Phoenix Precision Agency',
    description: 'Ready to transform your business online? Contact Phoenix Precision Agency for professional web development and digital solutions.',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted mb-8">
          Get in touch with Phoenix Precision Agency. We&apos;re here to help bring your vision to life.
        </p>
        
        <div className="bg-background rounded-lg shadow-sm border border-border p-8">
          <ContactForm />
        </div>
        
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-2">Response Time</h3>
            <p className="text-muted">
              We typically respond within 24 business hours
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
            <p className="text-muted">
              Monday - Friday: 9:00 AM - 6:00 PM EST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}