import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regler",
  description: "Uddrag af officielle petanque-regler med fold-ud sektioner."
};

const sections = [
  {
    title: "Generelt (§ 1-4)",
    points: [
      "Spilleformer: triple (3 mod 3), double (2 mod 2), single (1 mod 1).",
      "Kugler skal være godkendte metalkugler med korrekt diameter og vægt.",
      "Målkugle (gris) skal være godkendt træ/syntetisk kugle, 30 mm.",
      "Spillere skal kunne dokumentere medlemskab/licens ved turnering."
    ]
  },
  {
    title: "Spillet (§ 5-11)",
    points: [
      "Kamp spilles normalt til 13 point (nogle formater kan afvige).",
      "Kastecirkel skal placeres korrekt og fødder skal blive i cirklen under kast.",
      "Målkugle skal kastes ud i gyldig afstand og på gyldig position.",
      "Det er forbudt at manipulere underlaget ud over det tilladte."
    ]
  },
  {
    title: "Målkugle (§ 12-15)",
    points: [
      "Flyttes målkuglen ved uheld, lægges den tilbage hvis den var markeret.",
      "Målkuglen kan i visse tilfælde flytte til anden bane og stadig være spilbar.",
      "Hvis målkuglen bliver ugyldig/tabt i en omgang, gælder særlige pointregler.",
      "Hvis målkuglen stoppes af en spiller/tilskuer, gælder regler for genplacering."
    ]
  },
  {
    title: "Kugler (§ 16-24)",
    points: [
      "Det hold, der ligger længst fra målkuglen, spiller næste kugle.",
      "Maksimalt 1 minut pr. kast, ellers sanktion efter reglerne.",
      "Kugler uden for gyldigt område er tabte kugler.",
      "Ureglementeret kastet kugle er som udgangspunkt ugyldig."
    ]
  },
  {
    title: "Point og måling (§ 25-31)",
    points: [
      "Måling skal ske med egnet måleinstrument, ikke med fødder.",
      "Kugler må ikke fjernes før omgangen er afsluttet og point opgjort.",
      "Ved lige afstand til målkuglen gælder særregler for fortsat spil/omgang.",
      "Protester skal indgives under spillet, ikke efter kampafslutning."
    ]
  },
  {
    title: "Disciplin (§ 32-41)",
    points: [
      "Forsinkelse/udeblivelse giver pointstraf og kan føre til diskvalifikation.",
      "Sanktioner: gult kort, annulleret kugle, rødt kort, diskvalifikation.",
      "Usportslig opførsel, vold, rygning/mobil under kamp kan medføre bortvisning.",
      "Dommer og turneringsledelse træffer endelige afgørelser efter regelsættet."
    ]
  },
  {
    title: "Danske tillægsregler",
    points: [
      "Ved officielle DPF-turneringer må spillere ikke optræde beruset.",
      "Rygning og alkohol er ikke tilladt fra kampstart til kampens afslutning.",
      "Dopingkontrol kan forekomme ved officielle arrangementer.",
      "Spiller-ID/licens skal kunne fremvises på forlangende."
    ]
  }
];

export default function ReglerPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-8 shadow-card">
        <h1 className="text-4xl font-bold">Regler</h1>
        <p className="mt-3 text-stone">
          Herunder finder du et struktureret uddrag af de officielle regler. Tryk på en sektion for at folde den ud.
        </p>
        <a
          href="/docs/regler.pdf"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-md bg-moss px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f4f31]"
        >
          Åbn fulde regler (PDF)
        </a>
      </section>

      {sections.map((section) => (
        <details key={section.title} className="group rounded-xl bg-white p-5 shadow-card open:leaf-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-bold marker:content-none">
            {section.title}
            <span className="text-base text-stone transition group-open:rotate-180">v</span>
          </summary>
          <ul className="mt-4 space-y-2 text-stone">
            {section.points.map((point) => (
              <li key={point} className="rounded-md bg-[#f7f4ec] px-3 py-2">
                {point}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
