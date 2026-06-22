import Link from "next/link";
import type { Product } from "@/lib/types";
import { BookCover } from "./BookCover";

const badges = [
  "Download imediato",
  "Pagamento seguro",
  "Pix e cartão",
  "PDF pronto para imprimir",
];

export function Hero({ livros }: { livros: Product[] }) {
  const capas = livros.slice(0, 3);
  return (
    <section className="relative overflow-hidden">
      {/* brilho decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <p className="font-serif text-sm italic text-gold-dark">
            Evangelizando com cor e arte
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">
            Colorir a fé,
            <br />
            <span className="text-gold-dark">em família</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-ink-soft lg:mx-0">
            Livros de colorir católicos em PDF, com ilustrações exclusivas em
            contorno — prontos para imprimir e colorir em casa, na catequese e
            nos momentos de oração.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start">
            <Link
              href="#livros"
              className="w-full rounded-full bg-gold px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark sm:w-auto"
            >
              Ver os livros
            </Link>
            <Link
              href="#combo"
              className="w-full rounded-full border border-gold/40 px-7 py-3.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-gold/10 sm:w-auto"
            >
              Combo com desconto
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-soft lg:justify-start">
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <span className="text-green" aria-hidden>
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Capas em destaque */}
        <div className="flex items-end justify-center gap-2 sm:gap-3">
          {capas.map((livro, i) => (
            <div
              key={livro.id}
              className={
                i === 1
                  ? "w-1/3 max-w-[220px] -translate-y-3 sm:-translate-y-6"
                  : "w-1/3 max-w-[200px] translate-y-2"
              }
              style={{ rotate: i === 0 ? "-5deg" : i === 2 ? "5deg" : "0deg" }}
            >
              <BookCover
                src={livro.capa_url ?? ""}
                alt={`Capa do livro ${livro.titulo}`}
                priority={i === 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
