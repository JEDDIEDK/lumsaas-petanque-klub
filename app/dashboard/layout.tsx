import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-5">
      <nav className="flex flex-wrap gap-2 rounded-xl bg-white p-3 shadow-card">
        <Link href="/dashboard" className="rounded-full border border-black/10 px-3 py-1 text-sm">
          Oversigt
        </Link>
        <Link href="/dashboard/spilledage" className="rounded-full border border-black/10 px-3 py-1 text-sm">
          Spilledage
        </Link>
        {isAdmin ? (
          <Link href="/dashboard/admin" className="rounded-full border border-black/10 px-3 py-1 text-sm">
            Admin
          </Link>
        ) : null}
      </nav>
      {children}
    </div>
  );
}
