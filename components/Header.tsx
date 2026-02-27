import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/Button";
import { signOut } from "@/app/actions/auth";
import { getUser } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Forside" },
  { href: "/spilletider", label: "Spilletider" },
  { href: "/medlemskab", label: "Medlemskab" },
  { href: "/regler", label: "Regler" },
  { href: "/galleri", label: "Galleri" }
];

export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-sand/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold tracking-tight">
          <Image
            src="/images/Final%20logo.png"
            alt="Lumsås Petanque Klub logo"
            width={128}
            height={128}
            className="rounded-full border border-black/10 bg-white object-contain"
          />
          <span>Lumsås Petanque Klub</span>
        </Link>
        <nav className="hidden gap-5 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-charcoal hover:text-moss">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button href="/dashboard" variant="secondary" className="px-3 py-2 text-xs">
                Dashboard
              </Button>
              <form action={signOut}>
                <Button type="submit" className="px-3 py-2 text-xs">
                  Log ud
                </Button>
              </form>
            </>
          ) : (
            <Button href="/login" className="px-3 py-2 text-xs">
              Login
            </Button>
          )}
        </div>
      </div>
      <nav className="mx-auto flex w-full max-w-6xl gap-4 overflow-x-auto px-4 pb-3 md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap text-sm text-charcoal hover:text-moss">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
