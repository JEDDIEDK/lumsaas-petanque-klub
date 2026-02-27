import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureSeedEvents, getUpcomingEvents } from "@/lib/data";
import { fmtDate, fmtTime } from "@/lib/utils";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Medlemsdashboard."
};

export default async function DashboardPage() {
  const user = await requireAuth();
  await ensureSeedEvents();

  const events = await getUpcomingEvents(5);
  const myAttendance = await db.attendance.findMany({
    where: { userId: user.id, eventId: { in: events.map((e) => e.id) } }
  });
  const attendanceByEvent = new Map(myAttendance.map((a) => [a.eventId, a.status]));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-3 text-stone">Hej {user.name}. Her er de næste spilledage.</p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Næste spilledage</h2>
          <Link href="/dashboard/spilledage" className="text-sm font-medium text-moss">
            Tilmeld dig
          </Link>
        </div>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-black/10 p-3">
              <p className="font-semibold">{event.type}</p>
              <p className="text-sm text-stone">
                {fmtDate(event.date)} kl. {fmtTime(event.start_time)}
              </p>
              <p className="text-xs text-stone">Din status: {attendanceByEvent.get(event.id) || "ikke valgt"}</p>
            </div>
          ))}
        </div>
      </section>

      <ChangePasswordForm />
    </div>
  );
}
