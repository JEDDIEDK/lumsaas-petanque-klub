import type { Metadata } from "next";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";
import { db } from "@/lib/db";
import { ensureSeedEvents, getUpcomingEvents } from "@/lib/data";
import { fmtDate, fmtTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Spilletider",
  description: "Sommer- og vintertider for træning i Lumsås Petanque Klub."
};

export const dynamic = "force-dynamic";

export default async function SpilletiderPage() {
  await ensureSeedEvents();
  const events = await getUpcomingEvents(10);
  const attendance = await db.attendance.findMany({
    where: { eventId: { in: events.map((e) => e.id) } }
  });

  const countByEvent = new Map<number, { yes: number; maybe: number; no: number }>();
  for (const event of events) {
    countByEvent.set(event.id, { yes: 0, maybe: 0, no: 0 });
  }
  for (const row of attendance) {
    const counts = countByEvent.get(row.eventId);
    if (!counts) continue;
    if (row.status === "yes") counts.yes += 1;
    if (row.status === "maybe") counts.maybe += 1;
    if (row.status === "no") counts.no += 1;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <OpeningHoursCard showImage />

        <aside className="h-full rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">Kommende 10 spilledage</h2>
          <p className="mt-2 text-stone">Opdateres løbende. Viser kun antal tilmeldte, ikke hvem.</p>
          <div className="mt-4 space-y-3">
            {events.map((event) => {
              const c = countByEvent.get(event.id) ?? { yes: 0, maybe: 0, no: 0 };
              const total = c.yes + c.maybe + c.no;
              return (
                <article key={event.id} className="rounded-lg border border-black/10 p-3">
                  <p className="font-semibold">{event.type}</p>
                  <p className="text-sm text-stone">
                    {fmtDate(event.date)} kl. {fmtTime(event.start_time)}
                  </p>
                  <p className="mt-2 text-sm text-stone">Tilmeldt (kommer): {c.yes}</p>
                  <p className="text-xs text-stone">Svar i alt: {total}</p>
                </article>
              );
            })}
            {!events.length ? <p className="text-sm text-stone">Ingen kommende spilledage endnu.</p> : null}
          </div>
        </aside>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-2xl font-bold">Placering</h2>
        <p className="mt-2 text-stone">Banerne ligger i Lumsås. Åbn placeringen direkte i Google Maps.</p>
        <div className="mt-4 overflow-hidden rounded-lg border border-black/10">
          <iframe
            title="Lumsås Petanque Klub placering"
            src="https://www.google.com/maps?q=55.9398659,11.5162344&z=17&output=embed"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <a
          href="https://maps.app.goo.gl/dG35spdujiTSUWVE6"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f4f31]"
        >
          Åbn i Google Maps
        </a>
      </section>
    </div>
  );
}
