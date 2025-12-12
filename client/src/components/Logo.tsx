import { Link } from "wouter";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

export default function Logo({ variant = "default", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-cream" : "text-teal";
  const accentColor = variant === "light" ? "text-cream/60" : "text-gold";
  
  return (
    <Link href="/" data-testid="link-logo">
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`w-8 h-8 rounded-lg bg-teal flex items-center justify-center ${variant === "light" ? "bg-cream/20" : ""}`}>
          <span className="font-serif text-lg font-bold text-cream">K</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className={`font-serif text-lg md:text-xl font-semibold tracking-tight ${textColor}`}>
            Klara Project
          </span>
          <span className={`text-[10px] tracking-[0.2em] uppercase ${accentColor}`}>
            Clarity for the AI Age
          </span>
        </div>
      </div>
    </Link>
  );
}
