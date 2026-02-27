import { Button } from "@/components/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl shadow-card">
      <video
        className="h-[420px] w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/hero.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20" />
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-2xl p-8 text-white md:p-12">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/80">Lumsås Petanque Klub</p>
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">Kom og prøv gratis 2 gange</h1>
          <p className="mb-6 max-w-xl text-white/90">
            Bliv en del af et lokalt fællesskab med god stemning, natur og spilleglæde.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/medlemskab">Bliv medlem</Button>
            <Button href="/kontakt" variant="secondary" className="border-white text-white hover:bg-white hover:text-charcoal">
              Kontakt klubben
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
