import { Link } from "wouter";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
}

export default function Logo({ variant = "default", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-cream" : "text-teal";
  
  return (
    <Link href="/" data-testid="link-logo">
      <div className={`flex flex-col ${className}`}>
        <span className={`font-serif text-xs tracking-widest uppercase ${textColor} opacity-80`}>
          The
        </span>
        <span className={`font-serif text-xl md:text-2xl font-semibold tracking-tight ${textColor}`}>
          Klara Project
        </span>
      </div>
    </Link>
  );
}
