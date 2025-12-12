import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceCardProps {
  title: string;
  description: string;
  status: "available" | "in-progress" | "coming-soon";
  onDownload?: () => void;
  onLearnMore?: () => void;
}

export default function ResourceCard({ 
  title, 
  description, 
  status, 
  onDownload, 
  onLearnMore 
}: ResourceCardProps) {
  const statusLabels = {
    "available": "Available Now",
    "in-progress": "In Progress",
    "coming-soon": "Coming Soon",
  };

  const statusColors = {
    "available": "bg-teal/10 text-teal border-teal/30",
    "in-progress": "bg-gold/10 text-gold-dark border-gold/30",
    "coming-soon": "bg-charcoal-light/10 text-charcoal-muted border-charcoal-light/30",
  };

  return (
    <Card className="p-6 bg-card border-card-border">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-serif text-xl font-semibold text-charcoal">
          {title}
        </h3>
        <Badge variant="outline" className={`shrink-0 ${statusColors[status]}`}>
          {statusLabels[status]}
        </Badge>
      </div>
      
      <p className="text-charcoal-muted leading-relaxed mb-4">
        {description}
      </p>
      
      {status === "available" && onDownload && (
        <Button onClick={onDownload} className="bg-teal text-cream" data-testid={`button-download-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      )}
      
      {status === "in-progress" && onLearnMore && (
        <Button variant="outline" onClick={onLearnMore} className="border-teal text-teal" data-testid={`button-learn-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          Learn More
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
      
      {status === "coming-soon" && (
        <p className="text-charcoal-light text-sm italic">
          This resource will be available as funding allows.
        </p>
      )}
    </Card>
  );
}
