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
      <div className={`flex flex-col leading-none ${className}`}>
        <span className={`font-serif text-xl md:text-2xl font-normal tracking-tight ${textColor}`}>
          Klara Project
        </span>
        <span className={`text-[10px] tracking-[0.15em] uppercase font-medium ${accentColor}`}>
          Christian Clarity for the AI Age
        </span>
      </div>
    </Link>
  );
}
