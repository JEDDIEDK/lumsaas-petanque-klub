import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Lumsås Petanque Klub",
    template: "%s | Lumsås Petanque Klub"
  },
  description:
    "Lumsås Petanque Klub - fællesskab, frisk luft og præcision siden 1995. Kom og prøv gratis 2 gange.",
  openGraph: {
    title: "Lumsås Petanque Klub",
    description: "Kom og prøv gratis 2 gange",
    images: [{ url: "/images/Final%20logo.png", width: 512, height: 512 }]
  },
  icons: {
    icon: "/images/Final%20logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="min-h-screen text-charcoal antialiased">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
