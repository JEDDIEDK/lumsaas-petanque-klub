"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { GalleryImage } from "@/lib/types";

type Props = {
  images: GalleryImage[];
  enableFilter?: boolean;
};

export function GalleryGrid({ images, enableFilter = false }: Props) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const filtered = useMemo(() => {
    if (!enableFilter) return images;
    return images;
  }, [enableFilter, images]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((img) => (
          <button
            key={img.name}
            type="button"
            onClick={() => setActiveImage(img)}
            className="group relative overflow-hidden rounded-xl border border-black/5 bg-white shadow-card"
            aria-label={`Vis billede ${img.name}`}
          >
            <Image
              src={img.publicUrl}
              alt={img.name}
              width={1200}
              height={900}
              className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-charcoal opacity-0 transition group-hover:opacity-100">
              Klik for stor visning
            </span>
          </button>
        ))}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-white">
            <Image
              src={activeImage.publicUrl}
              alt={activeImage.name}
              width={1600}
              height={1200}
              className="h-auto max-h-[90vh] w-auto"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
