import type { Metadata } from "next";
import { AdminEventForm } from "@/components/AdminEventForm";
import { AdminResetPasswordForm } from "@/components/AdminResetPasswordForm";
import { deleteEvent } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureSeedEvents, getUpcomingEvents } from "@/lib/data";
import { fmtDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  description: "Administrer medlemmer og spilledage."
};

export default async function AdminPage() {
  await requireAdmin();
  await ensureSeedEvents();

  const [events, members] = await Promise.all([
    getUpcomingEvents(20),
    db.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Admin</h1>
        <p className="mt-3 text-stone">Administrer spilledage og medlemmer.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Opret spilledag</h2>
          <AdminEventForm />
        </div>
        <div className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">Medlemmer</h2>
          <ul className="mt-4 space-y-2 text-sm text-stone">
            {members.map((member) => (
              <li key={member.id}>
                {member.name} ({member.email}) - {member.role}
                <AdminResetPasswordForm email={member.email} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-2xl font-bold">Kommende spilledage</h2>
        <div className="mt-4 space-y-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-lg border border-black/10 p-3">
              <p className="font-semibold">
                {fmtDate(event.date)} - {event.type} ({event.start_time.slice(0, 5)})
              </p>
              <p className="text-sm text-stone">{event.note || "Ingen note"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button type="submit" className="rounded-md bg-red-700 px-3 py-2 text-xs font-semibold text-white">
                    Slet
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
