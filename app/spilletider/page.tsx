import type { Metadata } from "next";
import { addDays } from "date-fns";
import { OpeningHoursCard } from "@/components/OpeningHoursCard";
import { db } from "@/lib/db";
import { getUpcomingEvents } from "@/lib/data";
import { fmtDate, fmtTime } from "@/lib/utils";
import type { EventType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Spilletider",
  description: "Sommer- og vintertider for træning i Lumsås Petanque Klub."
};

export const dynamic = "force-dynamic";

export default async function SpilletiderPage() {
  const base = new Date(new Date().toDateString());
  const fallbackEvents: EventType[] = [2, 6, 9, 13, 16, 20].map((offset, idx) => ({
    id: -(idx + 1),
    date: addDays(base, offset).toISOString().slice(0, 10),
    start_time: offset % 2 === 0 ? "14:00" : "10:00",
    type: offset % 2 === 0 ? "Træning" : "Lørdagsspil",
    note: null as string | null,
    created_at: new Date().toISOString()
  }));

  let events: EventType[] = fallbackEvents;
  let attendance: Array<{ eventId: number; status: string }> = [];

  try {
    const dynamicEvents = await getUpcomingEvents(6);
    if (dynamicEvents.length) {
      events = dynamicEvents;
      attendance = await db.attendance.findMany({
        where: { eventId: { in: events.map((e) => e.id) } }
      });
    }
  } catch {
    // Keep fallback events and zero-count attendance if the runtime store is unavailable.
  }

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
          <h2 className="text-2xl font-bold">Kommende 6 spilledage</h2>
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
            src="https://www.google.com/maps/place/Lums%C3%A5s+M%C3%B8lle/@55.9396997,11.5154809,17z?output=embed"
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
