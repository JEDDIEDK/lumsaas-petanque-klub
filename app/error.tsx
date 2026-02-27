"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto my-16 max-w-2xl rounded-xl bg-white p-8 shadow-card">
      <h2 className="text-2xl font-bold">Der opstod en fejl</h2>
      <p className="mt-3 text-stone">
        Prøv igen. Hvis login fejler, kør <code>npm run db:push</code> i terminalen.
      </p>
      <button onClick={reset} className="mt-5 rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
        Prøv igen
      </button>
    </div>
  );
}
