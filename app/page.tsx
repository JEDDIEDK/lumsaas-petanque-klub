import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/HeroSection";
import { CTASection } from "@/components/CTASection";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";
import { GalleryGrid } from "@/components/GalleryGrid";
import { FrontVideo } from "@/components/FrontVideo";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Forside",
  description: "Velkommen til Lumsås Petanque Klub. Se spilletider, galleri og medlemskab."
};

export default async function HomePage() {
  const gallery = await getGalleryImages(6);

  return (
    <div className="space-y-10">
      <HeroSection />
      <FrontVideo />

      <section className="leaf-card fade-up grid gap-6 rounded-2xl p-8 shadow-card md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Et lokalt fællesskab siden 1995</h2>
          <p className="mt-3 text-stone">
            Hos os spiller vi petanque i naturen omkring Lumsås med plads til både nye og erfarne spillere.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-moss/90 p-3 text-center text-white">
              <p className="text-2xl font-bold">30+</p>
              <p className="text-xs uppercase tracking-wider">Medlemmer</p>
            </div>
            <div className="rounded-lg bg-white/90 p-3 text-center">
              <p className="text-2xl font-bold">1995</p>
              <p className="text-xs uppercase tracking-wider text-stone">Siden</p>
            </div>
            <div className="rounded-lg bg-white/90 p-3 text-center">
              <p className="text-2xl font-bold">2x</p>
              <p className="text-xs uppercase tracking-wider text-stone">Gratis prøv</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold">Hvorfor petanque?</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone">
            <li>Nem adgang: alle kan være med</li>
            <li>Socialt samvær i frisk luft</li>
            <li>Træner koncentration og præcision</li>
            <li>God motion uden hård belastning</li>
            <li>Perfekt blanding af hygge og konkurrence</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="overflow-hidden rounded-2xl bg-white shadow-card">
          <Image
            src="/images/hero.jpg"
            alt="Spil i klubben"
            width={1200}
            height={800}
            className="h-64 w-full object-cover"
          />
          <div className="p-5">
            <h3 className="text-2xl font-bold">Spil i naturen</h3>
            <p className="mt-2 text-stone">Vi mødes i rolige omgivelser, hvor fællesskab og frisk luft går hånd i hånd.</p>
          </div>
        </article>
        <article className="texture-bg rounded-2xl border border-black/5 p-6 shadow-card">
          <h3 className="text-2xl font-bold">Ugens stemning</h3>
          <p className="mt-2 text-stone">“Kom som du er. Her er plads til både grin, koncentration og gode kampe.”</p>
          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-moss px-3 py-1 text-xs text-white">Træning</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs text-charcoal">Turnering</span>
            <span className="rounded-full bg-white px-3 py-1 text-xs text-charcoal">Hygge</span>
          </div>
        </article>
      </section>

      <OpeningHoursCard />

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold">Seneste fra galleriet</h2>
          <Link href="/galleri" className="text-sm font-medium text-moss">
            Se hele galleriet
          </Link>
        </div>
        <GalleryGrid images={gallery} />
      </section>

      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h2 className="text-3xl font-bold">Kontakt os</h2>
        <p className="mt-3 text-stone">Har du spørgsmål om medlemskab eller spilletider? Vi hjælper gerne.</p>
        <Link href="/kontakt" className="mt-5 inline-block font-semibold text-moss">
          Gå til kontakt
        </Link>
      </section>

      <CTASection />
    </div>
  );
}
