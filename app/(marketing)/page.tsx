import DemoContainer from "@/components/demo/DemoContainer";
import TrustBadges from "@/components/TrustBadges";
import PerformanceMetrics from "@/components/PerformanceMetrics";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-light)] py-24 relative overflow-hidden">
        {/* Background pattern for aerospace precision feel */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 translate-x-[-50%] translate-y-[-50%]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your Business with
            <span className="block text-[var(--color-gold)] mt-2">Aerospace Precision</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            We turn outdated websites into modern digital experiences that drive growth, 
            engage customers, and deliver results with the same precision used in space missions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-[var(--color-accent)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--color-accent-light)] hover:shadow-xl transition-all inline-block transform hover:scale-105 border-2 border-[var(--color-accent)]"
            >
              Start Your Transformation
            </a>
            <a
              href="/portfolio"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[var(--color-primary)] transition-all inline-block transform hover:scale-105"
            >
              View Our Work
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-sm text-white/80 mb-6 font-medium">Trusted by businesses worldwide</p>
            <div className="flex items-center justify-center gap-8 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[var(--color-gold)] rounded-full shadow-lg"></div>
                <span className="font-medium">NASA-Grade Security</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full shadow-lg"></div>
                <span className="font-medium">24/7 Support</span>
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
      <section className="py-24 bg-gradient-to-b from-white to-[var(--color-gray-50)] relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--color-gold)] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[var(--color-accent)] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Approach
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
              Why Choose Phoenix Precision?
            </h2>
            <p className="text-lg text-[var(--color-muted)] max-w-3xl mx-auto leading-relaxed">
              We deliver more than just websites. We create digital experiences that elevate your brand
              with the same precision and attention to detail used in aerospace engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-10 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-[var(--color-gray-50)] shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transform hover:scale-105">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-primary)]/20 rounded-full blur-lg"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 group-hover:text-[var(--color-accent)] transition-colors">Data-Driven Design</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Every decision backed by analytics and user research to maximize your ROI and user engagement.
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-gold)] rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="group text-center p-10 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-[var(--color-gray-50)] shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transform hover:scale-105">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-gold)]/20 rounded-full blur-lg"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 group-hover:text-[var(--color-accent)] transition-colors">Custom Solutions</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Tailored to your unique business needs and goals, not one-size-fits-all templates.
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="group text-center p-10 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-white hover:to-[var(--color-gray-50)] shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 transform hover:scale-105">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/20 to-[var(--color-accent)]/20 rounded-full blur-lg"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-gold-dark)] rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary)] mb-4 group-hover:text-[var(--color-accent)] transition-colors">Proven Results</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Track record of increasing conversions and engagement for businesses like yours.
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-accent)] rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-light)] text-white relative overflow-hidden">
        {/* Background patterns for aerospace feel */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-gold)] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Premium badge */}
          <div className="inline-block bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 text-[var(--color-gold)] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Premium Digital Transformation
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Leave Your 
            <span className="block text-[var(--color-gold)] mt-2">Competition Behind?</span>
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Let&apos;s discuss how we can transform your digital presence and drive real business results
            with aerospace-grade precision and reliability.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a
              href="/contact"
              className="group bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] text-white px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl transition-all inline-block transform hover:scale-105 border-2 border-[var(--color-accent)]"
            >
              <span className="flex items-center justify-center gap-2">
                Get Your Free Consultation
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <a
              href="tel:+1-555-0123"
              className="border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-[var(--color-primary)] transition-all inline-block transform hover:scale-105"
            >
              Call Now: (555) 012-3456
            </a>
          </div>
          
          {/* Enhanced urgency and trust indicators */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm">
              <div className="w-3 h-3 bg-[var(--color-gold)] rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium">Limited spots available this month</span>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>No-risk consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--color-success)]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>NASA-certified team</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
