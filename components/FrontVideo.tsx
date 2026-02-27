import Image from "next/image";

export function FrontVideo() {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="text-3xl font-bold">Klubben i billeder</h2>
      <p className="mt-2 text-stone">Stemning fra fællesskabet ved møllen i Lumsås.</p>

      <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
        <Image
          src="/images/hero.jpg"
          alt="Klubbens medlemmer ved møllen"
          width={1600}
          height={900}
          className="h-auto w-full object-cover"
        />
      </div>
    </section>
  );
}
