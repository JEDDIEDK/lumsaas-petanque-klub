export function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white/50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-stone md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Lumsås Petanque Klub</p>
        <p>Frisk luft, fællesskab og præcision siden 1995.</p>
      </div>
    </footer>
  );
}
