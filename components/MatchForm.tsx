"use client";

import { useState } from "react";
import { addMatch } from "@/app/actions/matches";
import { getSeasonFromDate } from "@/lib/utils";

export function MatchForm() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 rounded-xl bg-white p-5 shadow-card"
      action={async (formData) => {
        const result = await addMatch(formData);
        setMessage(result.message);
      }}
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Dato</label>
          <input
            type="date"
            name="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
            className="w-full rounded-md border border-black/10 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Sæson</label>
          <input
            type="text"
            name="season"
            defaultValue={getSeasonFromDate()}
            required
            className="w-full rounded-md border border-black/10 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Spiller A</label>
          <input name="player_a" required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Spiller B</label>
          <input name="player_b" required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">Score A</label>
          <input name="score_a" type="number" min={0} required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm">Score B</label>
          <input name="score_b" type="number" min={0} required className="w-full rounded-md border border-black/10 px-3 py-2" />
        </div>
      </div>

      <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
        Tilføj kampresultat
      </button>
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </form>
  );
}
