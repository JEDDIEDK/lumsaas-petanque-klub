import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt Lumsås Petanque Klub."
};

export default function KontaktPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl bg-white p-6 shadow-card">
        <h1 className="text-4xl font-bold">Kontakt</h1>
        <div className="mt-5 space-y-3 text-stone">
          <p><strong>Formand:</strong> Fie Boeckel</p>
          <p><strong>E-mail:</strong> fieboeckel@gmail.com</p>
          <p><strong>Telefon:</strong> 30 54 90 63</p>
        </div>
      </section>
      <InquiryForm compact />
    </div>
  );
}
