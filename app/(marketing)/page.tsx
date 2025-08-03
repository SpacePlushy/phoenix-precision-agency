import DemoContainer from "@/components/demo/DemoContainer";
import TrustBadges from "@/components/TrustBadges";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="aerospace-gradient py-24 relative overflow-hidden">
        {/* Background pattern for aerospace precision feel */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 translate-x-[-50%] translate-y-[-50%]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="text-white space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Transform Your Business with
              <span className="block text-accent mt-2">Aerospace Precision</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We turn outdated websites into modern digital experiences that drive growth, 
              engage customers, and deliver results with the same precision used in space missions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/contact">
                  Start Your Transformation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                <Link href="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <Card className="mt-16 bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="text-sm text-white/80 mb-6 font-medium">Trusted by businesses worldwide</p>
                <div className="flex items-center justify-center gap-8 text-sm text-white/90 flex-wrap">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-glow mr-2"></div>
                    99.9% Uptime
                  </Badge>
                  <Badge variant="secondary" className="bg-gold/20 text-gold-light border-gold/30">
                    <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                    NASA-Grade Security
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    24/7 Support
                  </Badge>
                </div>
              </CardContent>
            </Card>
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
      <section className="py-24 aerospace-gradient-subtle relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Our Approach
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Why Choose Phoenix Precision?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We deliver more than just websites. We create digital experiences that elevate your brand
              with the same precision and attention to detail used in aerospace engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-border hover:border-accent/50">
              <CardContent className="p-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-lg"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Data-Driven Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every decision backed by analytics and user research to maximize your ROI and user engagement.
                </p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-accent to-gold rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-border hover:border-accent/50">
              <CardContent className="p-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-gold/20 rounded-full blur-lg"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Custom Solutions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tailored to your unique business needs and goals, not one-size-fits-all templates.
                </p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-border hover:border-accent/50">
              <CardContent className="p-10">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-accent/20 rounded-full blur-lg"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">Proven Results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track record of increasing conversions and engagement for businesses like yours.
                </p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-gold to-accent rounded-full mx-auto opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 aerospace-gradient text-white relative overflow-hidden">
        {/* Background patterns for aerospace feel */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-12">
              {/* Premium badge */}
              <Badge variant="secondary" className="bg-gold/20 text-gold-light border-gold/30 mb-6">
                Premium Digital Transformation
              </Badge>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Leave Your 
                <span className="block text-accent mt-2">Competition Behind?</span>
              </h2>
              <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Let&apos;s discuss how we can transform your digital presence and drive real business results
                with aerospace-grade precision and reliability.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg h-14 px-10">
                  <Link href="/contact" className="group">
                    <span className="flex items-center gap-2">
                      Get Your Free Consultation
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary text-lg h-14 px-10">
                  <Link href="tel:+1-555-0123">
                    Call Now: (555) 012-3456
                  </Link>
                </Button>
              </div>
              
              {/* Enhanced urgency and trust indicators */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-sm">
                  <div className="w-3 h-3 bg-gold rounded-full animate-pulse-glow"></div>
                  <span className="font-medium">Limited spots available this month</span>
                </div>
                
                <div className="flex items-center justify-center gap-8 text-sm opacity-90 flex-wrap">
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                    <svg className="w-4 h-4 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    No-risk consultation
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                    <svg className="w-4 h-4 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    30-day guarantee
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                    <svg className="w-4 h-4 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    NASA-certified team
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
