import { Award, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const badges: TrustBadge[] = [
  {
    icon: <Award className="size-6" />,
    title: "NASA Systems Engineer",
    subtitle: "Space-grade precision"
  },
  {
    icon: <Clock className="size-6" />,
    title: "15+ Years Experience",
    subtitle: "Proven expertise"
  },
  {
    icon: <Shield className="size-6" />,
    title: "100% Uptime Guarantee",
    subtitle: "Always online"
  }
];

export default function TrustBadges() {
  return (
    <section className="py-24 bg-background relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simplified Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            Our Credentials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Trust Phoenix Precision
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aerospace-grade expertise applied to your digital transformation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badges.map((badge, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-accent/20">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex-shrink-0">
                  <div className="size-14 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    {badge.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 font-semibold">
                    {badge.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {badge.subtitle}
                  </CardDescription>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Usage example:
// <TrustBadges />