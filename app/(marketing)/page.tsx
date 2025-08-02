import DemoContainer from "@/components/demo/DemoContainer";
import TrustBadges from "@/components/TrustBadges";
import PerformanceMetrics from "@/components/PerformanceMetrics";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-primary)] mb-6">
            Transform Your Business Online
          </h1>
          <p className="text-xl text-[var(--color-muted)] max-w-3xl mx-auto mb-8">
            We turn outdated websites into modern digital experiences that drive growth, 
            engage customers, and deliver results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-accent)]/90 hover:shadow-lg transition-all inline-block transform hover:scale-105"
            >
              Start Your Transformation
            </a>
            <a
              href="/portfolio"
              className="border-2 border-[var(--color-accent)] text-[var(--color-accent)] px-8 py-3 rounded-lg font-medium hover:bg-[var(--color-accent)] hover:text-white transition-all inline-block transform hover:scale-105"
            >
              View Our Work
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-[var(--color-muted)] mb-4">Trusted by businesses worldwide</p>
            <div className="flex items-center justify-center gap-8 text-xs text-[var(--color-muted)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>NASA-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo */}
      <DemoContainer />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Performance Metrics */}
      <PerformanceMetrics />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-4">
              Why Choose Phoenix Precision?
            </h2>
            <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
              We deliver more than just websites. We create digital experiences that elevate your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Data-Driven Design</h3>
              <p className="text-[var(--color-muted)]">
                Every decision backed by analytics and user research to maximize your ROI.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
              <p className="text-[var(--color-muted)]">
                Tailored to your unique business needs and goals, not one-size-fits-all templates.
              </p>
            </div>

            <div className="text-center p-8 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-[var(--color-muted)]">
                Track record of increasing conversions and engagement for businesses like yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-primary)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Leave Your Competition Behind?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let&apos;s discuss how we can transform your digital presence and drive real business results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-[var(--color-primary)] px-8 py-4 rounded-lg font-medium hover:shadow-xl transition-all inline-block transform hover:scale-105"
            >
              Get Your Free Consultation
            </a>
            <a
              href="tel:+1-555-0123"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white hover:text-[var(--color-primary)] transition-all inline-block transform hover:scale-105"
            >
              Call Now: (555) 012-3456
            </a>
          </div>
          
          {/* Urgency Indicator */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-80">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Limited spots available this month</span>
          </div>
        </div>
      </section>
    </div>
  );
}
