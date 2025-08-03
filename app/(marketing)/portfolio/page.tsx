import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Our Work',
  description: 'Explore Phoenix Precision Agency portfolio of successful web development projects. See how we transform businesses with modern, high-performance websites.',
  openGraph: {
    title: 'Phoenix Precision Agency Portfolio - Our Work',
    description: 'Explore our portfolio of successful web development projects and digital transformations.',
    url: '/portfolio',
  },
  alternates: {
    canonical: '/portfolio',
  },
};

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Our Work</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Showcasing our latest projects and success stories
      </p>
      {/* Portfolio grid will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <p className="text-muted-foreground col-span-full text-center">
          Portfolio projects coming soon...
        </p>
      </div>
    </div>
  );
}