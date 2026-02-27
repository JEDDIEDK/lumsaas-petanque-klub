import Image from "next/image";

type Props = {
  showImage?: boolean;
};

export function OpeningHoursCard({ showImage = false }: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-card">
      <h3 className="text-2xl font-bold">Spilletider</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Sommer</p>
          <ul className="mt-2 space-y-1 text-charcoal">
            <li>Mandag og onsdag: 14:00-16:00</li>
            <li>Lørdag: 10:00-12:00</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone">Vinter</p>
          <ul className="mt-2 space-y-1 text-charcoal">
            <li>Tirsdag og torsdag: 14:00-16:00</li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-sm text-stone">Banerne kan lejes til privat spil. Gæster velkomne - 30 kr. pr gang.</p>
      {showImage ? (
        <div className="mt-5 overflow-hidden rounded-lg border border-black/5">
          <Image
            src="/images/spilletider.jpg"
            alt="Skilt med åbningstider"
            width={900}
            height={600}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
