"use client";

import { useState } from "react";
import { createOrUpdateEvent } from "@/app/actions/admin";

type Props = {
  event?: {
    id: number;
    date: string;
    start_time: string;
    type: string;
    note: string | null;
  };
};

export function AdminEventForm({ event }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 rounded-xl bg-white p-4 shadow-card"
      action={async (formData) => {
        await createOrUpdateEvent(formData);
        setMessage("Spilledag gemt.");
      }}
    >
      <input type="hidden" name="id" defaultValue={event?.id ?? ""} />
      <label className="text-sm">Dato</label>
      <input
        name="date"
        type="date"
        defaultValue={event?.date}
        required
        className="rounded-md border border-black/10 px-3 py-2"
      />
      <label className="text-sm">Starttid</label>
      <input
        name="start_time"
        type="time"
        defaultValue={event?.start_time}
        required
        className="rounded-md border border-black/10 px-3 py-2"
      />
      <label className="text-sm">Type</label>
      <input
        name="type"
        defaultValue={event?.type ?? "Træning"}
        required
        className="rounded-md border border-black/10 px-3 py-2"
      />
      <label className="text-sm">Note</label>
      <textarea name="note" defaultValue={event?.note ?? ""} className="rounded-md border border-black/10 px-3 py-2" />
      <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
        {event ? "Opdater" : "Opret"}
      </button>
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </form>
  );
}
