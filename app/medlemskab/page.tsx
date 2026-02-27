import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Medlemskab",
  description: "Bliv medlem i Lumsås Petanque Klub."
};

export default function MedlemskabPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Medlemskab</h1>
        <p className="mt-3 max-w-2xl text-stone">Prøv gratis 2 gange før du beslutter dig. Alle aldre og niveauer er velkomne.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Årligt kontingent</p>
            <p className="mt-2 text-2xl font-semibold">500 kr.</p>
          </div>
          <div className="rounded-lg border border-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Indmeldelsesgebyr</p>
            <p className="mt-2 text-2xl font-semibold">0 kr.</p>
          </div>
          <div className="rounded-lg border border-black/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-stone">Gæster</p>
            <p className="mt-2 text-2xl font-semibold">30 kr./gang</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="#bliv-medlem">Bliv medlem</Button>
          <Button href="/kontakt" variant="secondary">
            Kontakt bestyrelsen
          </Button>
        </div>
      </section>

      <section id="bliv-medlem">
        <h2 className="mb-4 text-3xl font-bold">Bliv medlem</h2>
        <InquiryForm />
      </section>
    </div>
  );
}
