import { Award, Clock, Shield } from "lucide-react";

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const badges: TrustBadge[] = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "NASA Systems Engineer",
    subtitle: "Space-grade precision"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "15+ Years Experience",
    subtitle: "Proven expertise"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "100% Uptime Guarantee",
    subtitle: "Always online"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-16 bg-[var(--color-gray-50)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-4">
            Aerospace-Grade Excellence
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Bringing space mission precision to your digital transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="group flex items-center gap-6 p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--color-border)] hover:border-[var(--color-accent)]/30 hover:transform hover:scale-105"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--color-primary)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                  {badge.title}
                </h3>
                <p className="text-[var(--color-muted)] font-medium">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Gold accent divider */}
        <div className="mt-12 flex items-center justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-light)] rounded-full shadow-sm"></div>
        </div>
      </div>
    </section>
  );
}

// Usage example:
// <TrustBadges />