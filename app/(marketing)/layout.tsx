import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Phoenix Precision Agency</h3>
              <p className="text-sm opacity-90">
                Transforming businesses with aerospace-grade precision and modern web solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link></li>
                <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm opacity-90">
                Email: fmp321@gmail.com<br />
                Phone: (602) 531-4111
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm opacity-75">
            <p>&copy; 2024 Phoenix Precision Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}