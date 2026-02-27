import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regler",
  description: "Grundregler for petanque i klubben."
};

const sections = [
  {
    title: "Formål",
    body: "Spillet går ud på at placere dine kugler tættere på grisen end modstanderen."
  },
  {
    title: "Banen",
    body: "Der spilles på grusbaner med fast underlag. Hold god afstand og vis hensyn under kast."
  },
  {
    title: "Kast/turns",
    body: "Holdene skiftes til at kaste. Det hold, der ligger længst fra grisen, kaster næste kugle."
  },
  {
    title: "Point til 13",
    body: "Runden afsluttes når alle kugler er kastet. Der gives point til holdet med kugler tættest på grisen. Først til 13 point vinder."
  },
  {
    title: "Udstyr",
    body: "Spil med godkendte stålkugler og en gris. Husk passende fodtøj til grusbanen."
  }
];

export default function ReglerPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Regler</h1>
        <p className="mt-3 text-stone">Her er en enkel introduktion til de vigtigste regler i petanque.</p>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="rounded-xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold">{section.title}</h2>
          <p className="mt-2 text-stone">{section.body}</p>
        </section>
      ))}

      <section className="rounded-xl border border-dashed border-black/20 p-6 text-stone">
        TODO: Mulighed for PDF med fulde regler.
      </section>
    </div>
  );
}
