import { Button } from "@/components/Button";

export function CTASection() {
  return (
    <section className="texture-bg rounded-2xl border border-black/5 p-8 shadow-card">
      <h2 className="text-3xl font-bold">Klar til at prøve?</h2>
      <p className="mt-3 max-w-2xl text-stone">
        Vi tager godt imod nye spillere. Du behøver ikke erfaring, kun lyst til at være med.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/medlemskab">Bliv medlem</Button>
        <Button href="/spilletider" variant="secondary">
          Se spilletider
        </Button>
      </div>
    </section>
  );
}
