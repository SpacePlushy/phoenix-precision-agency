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
      <section className="relative overflow-hidden aerospace-gradient py-24">
        {/* Background pattern for aerospace precision feel */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-background/10 to-transparent transform rotate-45 translate-x-[-50%] translate-y-[-50%]"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-primary-foreground">
              Transform Your Business with
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600">Aerospace Precision</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              We turn outdated websites into modern digital experiences that drive growth, 
              engage customers, and deliver results with the same precision used in space missions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Link href="/contact">
                  Start Your Transformation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-background/20 text-primary-foreground hover:bg-background/10 hover:border-background/30 backdrop-blur-sm transition-all hover:scale-105 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Link href="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <Card className="mt-16 bg-background/10 border-background/20 backdrop-blur-sm hover:bg-background/15 hover:border-background/30 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <p className="text-sm text-primary-foreground/80 mb-6 font-medium tracking-wide uppercase">Trusted by businesses worldwide</p>
                <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                  <Badge variant="secondary" className="bg-success/20 text-primary-foreground border-success/30 hover:bg-success/30 transition-all px-4 py-2" data-testid="hero-uptime-badge">
                    <div className="size-2 bg-success rounded-full animate-pulse mr-2"></div>
                    <span className="font-medium">99.9% Uptime</span>
                  </Badge>
                  <Badge variant="secondary" className="bg-gold/20 text-primary-foreground border-gold/30 hover:bg-gold/30 transition-all px-4 py-2" data-testid="hero-security-badge">
                    <div className="size-2 bg-gold rounded-full mr-2"></div>
                    <span className="font-medium">NASA-Grade Security</span>
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/20 text-primary-foreground border-accent/30 hover:bg-accent/30 transition-all px-4 py-2" data-testid="hero-support-badge">
                    <div className="size-2 bg-accent rounded-full mr-2"></div>
                    <span className="font-medium">24/7 Support</span>
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
      <section className="py-24 bg-background relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5">
              Our Approach
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Phoenix Precision?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We deliver more than just websites – we create digital experiences with aerospace precision
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group text-center hover:shadow-lg transition-all duration-300 border-border hover:border-accent/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Data-Driven Design</h3>
                <p className="text-muted-foreground">
                  Every decision backed by analytics and user research to maximize your ROI
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-lg transition-all duration-300 border-border hover:border-accent/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Custom Solutions</h3>
                <p className="text-muted-foreground">
                  Tailored to your unique business needs, not one-size-fits-all templates
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center hover:shadow-lg transition-all duration-300 border-border hover:border-accent/20">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
                <p className="text-muted-foreground">
                  Track record of increasing conversions and engagement for businesses
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 aerospace-gradient relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-background/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-background/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Card className="bg-background/10 border-background/20 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-foreground">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                Let&apos;s discuss how we can elevate your digital presence with aerospace-grade precision
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Link href="/contact">
                    Get Your Free Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-background/20 text-primary-foreground hover:bg-background/10 min-h-[44px] min-w-[44px] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Link href="tel:+16025314111">
                    Call: (602) 531-4111
                  </Link>
                </Button>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30">
                  <svg className="size-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free Consultation
                </Badge>
                <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30">
                  <svg className="size-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  30-Day Guarantee
                </Badge>
                <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30">
                  <svg className="size-4 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  NASA Engineer
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
