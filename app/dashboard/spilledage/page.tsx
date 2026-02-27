import type { Metadata } from "next";
import { AttendanceCard } from "@/components/AttendanceCard";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureSeedEvents, getUpcomingEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Spilledage",
  description: "Tilmeld dig kommende spilledage."
};

export default async function SpilledagePage() {
  const user = await requireAuth();
  await ensureSeedEvents();

  const events = await getUpcomingEvents(12);
  const eventIds = events.map((e) => e.id);

  const myAttendance = await db.attendance.findMany({
    where: { userId: user.id, eventId: { in: eventIds } }
  });
  const attendanceMap = new Map(myAttendance.map((a) => [a.eventId, a]));

  const allAttendance = await db.attendance.findMany({
    where: { eventId: { in: eventIds } },
    include: { user: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Spilledage</h1>
        <p className="mt-3 text-stone">Vælg din status for kommende spilledage.</p>
      </section>

      {events.map((event) => {
        const mine = attendanceMap.get(event.id);
        const participants = allAttendance.filter((a) => a.eventId === event.id);

        return (
          <section key={event.id} className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <AttendanceCard
              event={event}
              initialStatus={(mine?.status as "yes" | "maybe" | "no") ?? "maybe"}
              initialComment={mine?.comment ?? ""}
            />
            <div className="rounded-xl bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold">Deltagere</h3>
              <ul className="mt-3 space-y-2 text-sm text-stone">
                {participants.map((p) => (
                  <li key={`${p.eventId}-${p.userId}`}>
                    {p.user.name} - {p.status}
                  </li>
                ))}
                {!participants.length ? <li>Ingen tilmeldinger endnu.</li> : null}
              </ul>
            </div>
          </section>
        );
      })}
    </div>
  );
}
