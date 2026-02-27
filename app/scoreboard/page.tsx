import type { Metadata } from "next";
import { MatchForm } from "@/components/MatchForm";
import { ScoreTable } from "@/components/ScoreTable";
import { getMatchesBySeason, getRankingForSeason } from "@/lib/data";
import { getUser } from "@/lib/auth";
import { getSeasonFromDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Scoreboard",
  description: "Offentlig sæsonranking med mulighed for medlemmer at tilføje kampresultater."
};

type Props = {
  searchParams: Promise<{ season?: string }>;
};

export default async function ScoreboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const season = params.season || getSeasonFromDate();
  const [ranking, matches, user] = await Promise.all([
    getRankingForSeason(season),
    getMatchesBySeason(season),
    getUser()
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Scoreboard</h1>
        <p className="mt-3 text-stone">Sæson {season}. Sortering: points desc, diff desc, navn asc.</p>
      </section>

      <form className="rounded-xl bg-white p-4 shadow-card" method="get">
        <label className="mb-1 block text-sm">Sæson</label>
        <div className="flex gap-2">
          <input
            name="season"
            defaultValue={season}
            className="rounded-md border border-black/10 px-3 py-2"
            aria-label="Vælg sæson"
          />
          <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
            Filtrer
          </button>
        </div>
      </form>

      <ScoreTable rows={ranking} />

      <section className="rounded-xl bg-white p-6 shadow-card">
        <h2 className="text-2xl font-bold">Seneste kampe</h2>
        <div className="mt-4 space-y-2 text-sm text-stone">
          {matches.map((m) => (
            <p key={m.id}>
              {m.date}: {m.player_a} {m.score_a} - {m.score_b} {m.player_b}
            </p>
          ))}
          {!matches.length ? <p>Ingen kampe registreret.</p> : null}
        </div>
      </section>

      {user ? (
        <section>
          <h2 className="mb-3 text-2xl font-bold">Tilføj kampresultat</h2>
          <MatchForm />
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-black/20 p-5 text-stone">
          Log ind for at tilføje kampresultater.
        </section>
      )}
    </div>
  );
}
