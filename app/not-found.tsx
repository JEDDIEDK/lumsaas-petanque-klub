import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto my-16 max-w-2xl rounded-xl bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold">Siden blev ikke fundet</h1>
      <p className="mt-3 text-stone">Prøv at gå tilbage til forsiden.</p>
      <Link href="/" className="mt-5 inline-block rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
        Til forsiden
      </Link>
    </div>
  );
}
