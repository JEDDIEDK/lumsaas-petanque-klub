import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { registerMember, signInWithPassword } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "Login",
  description: "Login til medlemsområdet."
};

type LoginPageProps = {
  searchParams: Promise<{
    mode?: string;
    error?: string;
    name?: string;
    email?: string;
    phone?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getUser();
  if (user) redirect("/dashboard");
  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Login</h1>
        <p className="mt-3 text-stone">Log ind eller opret medlem for at tilmelde dig spilledage.</p>
        <p className="mt-2 text-sm text-stone">Glemt kode? Kontakt en admin, som kan nulstille den i dashboardet.</p>
        {params.error ? <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p> : null}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <form action={signInWithPassword} className="grid gap-3 rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">Log ind</h2>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={mode === "login" ? (params.email ?? "") : ""}
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
            Log ind
          </button>
        </form>

        <form action={registerMember} className="grid gap-3 rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">Opret medlem</h2>
          <div>
            <label className="mb-1 block text-sm">Navn</label>
            <input
              name="name"
              required
              defaultValue={mode === "register" ? (params.name ?? "") : ""}
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={mode === "register" ? (params.email ?? "") : ""}
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Telefon</label>
            <input
              name="phone"
              defaultValue={mode === "register" ? (params.phone ?? "") : ""}
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input
              name="password"
              type="password"
              minLength={6}
              required
              className="w-full rounded-md border border-black/10 px-3 py-2"
            />
          </div>
          <button type="submit" className="rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white">
            Opret medlem
          </button>
        </form>
      </section>
    </div>
  );
}
