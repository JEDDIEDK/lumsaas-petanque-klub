import type { RankingRow } from "@/lib/types";

type Props = {
  rows: RankingRow[];
};

export function ScoreTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-card">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-black/5 text-xs uppercase tracking-wide text-stone">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Navn</th>
            <th className="px-4 py-3">Point</th>
            <th className="px-4 py-3">Diff</th>
            <th className="px-4 py-3">Kampe</th>
            <th className="px-4 py-3">Sejre</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.name} className="border-t border-black/5">
              <td className="px-4 py-3">{idx + 1}</td>
              <td className="px-4 py-3 font-medium">{row.name}</td>
              <td className="px-4 py-3">{row.points}</td>
              <td className="px-4 py-3">{row.diff}</td>
              <td className="px-4 py-3">{row.played}</td>
              <td className="px-4 py-3">{row.wins}</td>
            </tr>
          ))}
          {!rows.length ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-stone">
                Ingen kampe registreret endnu.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
