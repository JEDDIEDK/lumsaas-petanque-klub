import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryImages } from "@/lib/data";

export const metadata: Metadata = {
  title: "Galleri",
  description: "Se billeder fra træning, turnering og hygge i klubben."
};

export default async function GalleriPage() {
  const images = await getGalleryImages(60);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Galleri</h1>
        <p className="mt-3 text-stone">Øjeblikke fra træning, turneringer og socialt samvær i klubben.</p>
      </section>
      <GalleryGrid images={images} enableFilter />
    </div>
  );
}
