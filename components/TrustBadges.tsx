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
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-accent)]/10 rounded-full flex items-center justify-center text-[var(--color-accent)]">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-primary)]">
                  {badge.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)]">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Usage example:
// <TrustBadges />