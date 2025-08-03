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
    <section className="py-16 bg-muted/30 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Aerospace-Grade Excellence
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Bringing Space Mission Precision
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            To your digital transformation with proven expertise and reliability
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-border hover:border-accent/20 hover:-translate-y-1 shadow-md bg-card">
              <CardContent className="flex items-center gap-6 p-8">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                  <div className="relative size-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                    {badge.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 group-hover:text-accent transition-colors font-bold">
                    {badge.title}
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {badge.subtitle}
                  </CardDescription>
                </div>
                <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full opacity-30 group-hover:opacity-100 transition-opacity"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Gold accent divider */}
        <div className="mt-12 flex items-center justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-gold to-gold-dark rounded-full shadow-sm"></div>
        </div>
      </div>
    </section>
  );
}

// Usage example:
// <TrustBadges />