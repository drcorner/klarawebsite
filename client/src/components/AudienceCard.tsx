import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AudienceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function AudienceCard({ icon: Icon, title, description }: AudienceCardProps) {
  return (
    <Card className="p-6 bg-card border-card-border hover-elevate">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
        {title}
      </h3>
      <p className="text-charcoal-muted leading-relaxed">
        {description}
      </p>
    </Card>
  );
}
