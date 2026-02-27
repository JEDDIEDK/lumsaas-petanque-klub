import type { Metadata } from "next";
import Image from "next/image";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";

export const metadata: Metadata = {
  title: "Spilletider",
  description: "Sommer- og vintertider for træning i Lumsås Petanque Klub."
};

export default function SpilletiderPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <OpeningHoursCard showImage />
        <section className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">Placering</h2>
          <p className="mt-2 text-stone">Banerne ligger i Lumsås. Åbn placeringen direkte i Google Maps.</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-black/10">
            <iframe
              title="Lumsås Petanque Klub placering"
              src="https://www.google.com/maps?q=Lums%C3%A5s%20Petanque%20Klub&output=embed"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/fRKyPKn31n66jwVP6"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f4f31]"
          >
            Åbn i Google Maps
          </a>
        </section>
      </div>

      <aside className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-2xl font-bold">Scan for info</h2>
        <p className="mt-2 text-stone">Scan QR-koden for hurtig adgang til information om klubben.</p>
        <Image src="/images/qr.png" alt="QR kode" width={500} height={500} className="mt-4 h-auto w-full" />
      </aside>
    </div>
  );
}
