import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/format";
import { BookCover } from "./BookCover";
import { BuyButton } from "@/components/BuyButton";

// Cor de destaque por livro (combina com a capa). Padrão: dourado.
const accent: Record<string, string> = {
  "grandes-momentos-da-fe": "bg-navy",
  "vida-dos-santos-e-milagres": "bg-wine",
  "cenas-biblicas-e-sacramentos": "bg-green",
};

export function BookCard({ product }: { product: Product }) {
  const badge = accent[product.slug] ?? "bg-gold-dark";
  const href = `/produto/${product.slug}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-cream-soft shadow-sm transition-shadow hover:shadow-md">
      <Link href={href} className="block px-5 pt-5">
        <BookCover src={product.capa_url ?? ""} alt={`Capa — ${product.titulo}`} />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`mb-3 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold text-white ${badge}`}
        >
          {product.num_desenhos} desenhos
        </span>

        <h3 className="font-serif text-xl font-bold text-ink">
          <Link href={href} className="transition-colors hover:text-gold-dark">
            {product.titulo}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {product.descricao}
        </p>

        <div className="mt-4">
          <p className="text-2xl font-bold text-ink">
            {formatBRL(product.preco_centavos)}
          </p>
          <p className="text-xs text-ink-soft">PDF • pagamento único</p>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <BuyButton
            productId={product.id}
            titulo={product.titulo}
            precoCentavos={product.preco_centavos}
            label="Comprar"
            className="w-full"
          />
          <Link
            href={href}
            className="text-center text-sm font-medium text-gold-dark hover:underline"
          >
            Ver detalhes →
          </Link>
        </div>
      </div>
    </article>
  );
}
