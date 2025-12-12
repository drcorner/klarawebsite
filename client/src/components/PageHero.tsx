interface PageHeroProps {
  title: string;
  subtitle?: string;
  variant?: "default" | "image";
  imageSrc?: string;
}

export default function PageHero({ title, subtitle, variant = "default", imageSrc }: PageHeroProps) {
  if (variant === "image" && imageSrc) {
    return (
      <section className="relative py-20 md:py-28">
        <div className="absolute inset-0 z-0">
          <img src={imageSrc} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/80 to-charcoal/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-xl text-cream-dark/90 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {imageSrc && (
          <p className="absolute bottom-2 right-4 text-cream/30 text-xs z-10">
            Image generated with AI
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="bg-cream-dark py-16 md:py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-xl text-charcoal-muted max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
