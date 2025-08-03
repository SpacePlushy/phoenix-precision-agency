import ContactForm from '@/components/forms/ContactForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with Phoenix Precision Agency. We&apos;re here to help bring your vision to life.
          </p>
        </div>
        
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-border hover:border-accent/30">
          <CardHeader>
            <CardTitle className="text-2xl">Get Your Free Consultation</CardTitle>
            <CardDescription className="text-base">
              Tell us about your project and let&apos;s discuss how we can help transform your digital presence.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
        
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card className="text-center md:text-left p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-0">
              <h3 className="font-semibold text-lg mb-2 text-primary">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond within 24 business hours
              </p>
            </CardContent>
          </Card>
          <Card className="text-center md:text-left p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-0">
              <h3 className="font-semibold text-lg mb-2 text-primary">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}