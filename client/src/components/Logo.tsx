import { Link } from "wouter";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

export default function Logo({ variant = "default", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-cream" : "text-charcoal";
  const accentColor = variant === "light" ? "text-cream/60" : "text-primary";
  
  return (
    <Link href="/" data-testid="link-logo">
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm ${variant === "light" ? "from-cream/20 to-cream/10" : ""}`}>
          <span className="font-sans text-lg font-bold text-cream">K</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className={`font-sans text-lg md:text-xl font-bold tracking-tight ${textColor}`}>
            Klara Project
          </span>
          <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${accentColor}`}>
            Christian Clarity for the AI Age
          </span>
        </div>
      </div>
    </Link>
  );
}
