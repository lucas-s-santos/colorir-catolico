import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { BookCover } from "./BookCover";
import { BuyButton } from "@/components/BuyButton";

export function ComboSection({
  combo,
  livros,
}: {
  combo: Product;
  livros: Product[];
}) {
  const soma = livros.reduce((s, l) => s + l.preco_centavos, 0);
  const economia = Math.max(soma - combo.preco_centavos, 0);

  return (
    <section id="combo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="overflow-hidden rounded-3xl bg-ink text-cream-soft shadow-lg">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            {/* Capas */}
            <div className="flex items-end justify-center gap-2 sm:gap-3">
              {livros.slice(0, 3).map((l, i) => (
                <div
                  key={l.id}
                  className="w-1/3 max-w-[160px]"
                  style={{ rotate: i === 0 ? "-4deg" : i === 2 ? "4deg" : "0deg" }}
                >
                  <BookCover src={l.capa_url ?? ""} alt={`Capa — ${l.titulo}`} />
                </div>
              ))}
            </div>

            {/* Texto + preço */}
            <div>
              <p className="font-serif text-sm uppercase tracking-[0.25em] text-gold-light">
                Coleção completa
              </p>
              <h2 className="mt-2 text-3xl font-bold text-cream-soft sm:text-4xl">
                {combo.titulo}
              </h2>
              <p className="mt-4 leading-relaxed text-cream-soft/80">
                {combo.descricao}
              </p>

              <ul className="mt-5 space-y-1.5 text-sm text-cream-soft/90">
                {livros.map((l) => (
                  <li key={l.id} className="flex items-center gap-2">
                    <span className="text-gold-light" aria-hidden>
                      ✓
                    </span>
                    {l.titulo} ({l.num_desenhos} desenhos)
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                {economia > 0 && (
                  <span className="text-lg text-cream-soft/60 line-through">
                    {formatBRL(soma)}
                  </span>
                )}
                <span className="text-4xl font-bold text-cream-soft">
                  {formatBRL(combo.preco_centavos)}
                </span>
                {economia > 0 && (
                  <span className="rounded-full bg-gold px-3 py-1 text-sm font-semibold text-ink">
                    economize {formatBRL(economia)}
                  </span>
                )}
              </div>

              <div className="mt-6">
                <BuyButton
                  slug={combo.slug}
                  label="Quero o combo completo"
                  variant="combo"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
