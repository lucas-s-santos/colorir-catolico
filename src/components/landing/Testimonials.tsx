import { SectionHeading } from "./SectionHeading";

// ⚠️ EXEMPLOS — substitua por depoimentos REAIS de clientes antes de publicar.
// Publicar depoimentos fabricados é propaganda enganosa (CDC/CONAR).
const depoimentos = [
  {
    texto:
      "Imprimi para a catequese e as crianças amaram. Os traços são lindos e fáceis de colorir.",
    nome: "— exemplo (substituir)",
  },
  {
    texto:
      "Comprei o combo e virou nosso momento em família no fim de semana. Recebi na hora por e-mail.",
    nome: "— exemplo (substituir)",
  },
  {
    texto:
      "Material caprichado e barato. Dá para imprimir quantas vezes quiser. Recomendo!",
    nome: "— exemplo (substituir)",
  },
];

export function Testimonials() {
  return (
    <section className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading eyebrow="Quem já colore" title="Feito para acolher" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {depoimentos.map((d, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-gold/20 bg-cream-soft p-6 shadow-sm"
            >
              <div className="mb-3 text-gold" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="flex-1 text-ink-soft">
                “{d.texto}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-ink">
                {d.nome}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
