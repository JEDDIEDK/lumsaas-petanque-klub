"use client";

import { useState } from "react";
import type { AttendanceStatus, EventType } from "@/lib/types";
import { fmtDate, fmtTime } from "@/lib/utils";
import { saveAttendance } from "@/app/actions/attendance";

type Props = {
  event: EventType;
  initialStatus?: AttendanceStatus;
  initialComment?: string;
};

export function AttendanceCard({ event, initialStatus = "maybe", initialComment = "" }: Props) {
  const [status, setStatus] = useState<AttendanceStatus>(initialStatus);
  const [comment, setComment] = useState(initialComment);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSave = async () => {
    setPending(true);
    const result = await saveAttendance({
      eventId: event.id,
      status,
      comment
    });
    setPending(false);
    setMessage(result.message);
  };

  return (
    <article className="rounded-xl bg-white p-5 shadow-card">
      <h3 className="text-lg font-semibold">{event.type}</h3>
      <p className="mt-1 text-sm text-stone">
        {fmtDate(event.date)} kl. {fmtTime(event.start_time)}
      </p>
      {event.note ? <p className="mt-2 text-sm text-stone">{event.note}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { key: "yes", label: "Kommer" },
          { key: "maybe", label: "Måske" },
          { key: "no", label: "Kommer ikke" }
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            className={`rounded-full px-3 py-1 text-sm ${
              status === item.key ? "bg-moss text-white" : "border border-black/10 bg-white"
            }`}
            onClick={() => setStatus(item.key as AttendanceStatus)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="mt-4 w-full rounded-md border border-black/10 px-3 py-2 text-sm"
        placeholder="Kommentar (valgfri)"
        rows={3}
      />

      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="mt-3 rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Gemmer..." : "Gem status"}
      </button>
      {message ? <p className="mt-2 text-sm text-stone">{message}</p> : null}
    </article>
  );
}
