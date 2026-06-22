import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { LANDING_PREVIEWS } from "@/lib/previews";

export function PreviewSection() {
  return (
    <section className="bg-cream-soft">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Uma espiada"
          title="Páginas de verdade, prontas para colorir"
          subtitle="Amostras reais dos livros — traços limpos e generosos, fáceis de pintar com lápis de cor ou giz, para crianças e adultos."
        />
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {LANDING_PREVIEWS.map((p) => (
            <figure
              key={p.src}
              className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm"
            >
              <div className="relative aspect-3/2 w-full">
                <Image
                  src={p.src}
                  alt={`Desenho para colorir — ${p.label}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                  className="object-contain p-2"
                />
              </div>
              <figcaption className="px-3 pb-3 pt-1 text-center text-sm font-medium text-ink-soft">
                {p.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink-soft">
          Estas são algumas páginas dos livros. Cada livro traz muitos outros
          desenhos.
        </p>
      </div>
    </section>
  );
}
