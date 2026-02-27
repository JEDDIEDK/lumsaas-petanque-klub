"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="da">
      <body className="bg-sand text-charcoal">
        <div className="mx-auto my-16 max-w-2xl rounded-xl bg-white p-8 shadow-card">
          <h1 className="text-2xl font-bold">Der opstod en fejl</h1>
          <p className="mt-3 text-stone">{error.message || "Ukendt fejl"}</p>
          <button onClick={reset} className="mt-5 rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
            Prøv igen
          </button>
        </div>
      </body>
    </html>
  );
}
