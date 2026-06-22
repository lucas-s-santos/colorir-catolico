import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveProducts, getProductBySlug } from "@/lib/products";
import { getPreviews } from "@/lib/previews";
import { formatBRL } from "@/lib/format";
import { BookCover } from "@/components/landing/BookCover";
import { BuyButton } from "@/components/BuyButton";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Livro não encontrado" };
  return {
    title: product.titulo,
    description: product.descricao,
    openGraph: {
      title: product.titulo,
      description: product.descricao,
      images: product.capa_url ? [{ url: product.capa_url }] : undefined,
    },
  };
}

const inclui = [
  "Arquivo em PDF de alta qualidade (A4)",
  "Pronto para imprimir quantas vezes quiser",
  "Download imediato após o pagamento",
  "Para uso pessoal e em família",
];

export default async function ProdutoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const amostras = getPreviews(product.slug);

  // Resolve os livros incluídos, quando for combo.
  let itensCombo: { id: string; titulo: string; num_desenhos: number }[] = [];
  if (product.tipo === "combo" && product.itens_combo.length > 0) {
    const todos = await getActiveProducts();
    itensCombo = product.itens_combo
      .map((id) => todos.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({ id: p.id, titulo: p.titulo, num_desenhos: p.num_desenhos }));
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/#livros"
        className="text-sm font-medium text-gold-dark hover:underline"
      >
        ← Voltar aos livros
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Capa */}
        <div className="mx-auto w-full max-w-sm lg:sticky lg:top-24 lg:self-start">
          <BookCover
            src={product.capa_url ?? ""}
            alt={`Capa — ${product.titulo}`}
            priority
          />
        </div>

        {/* Detalhes */}
        <div>
          <span className="inline-flex rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
            {product.num_desenhos} desenhos para colorir
          </span>
          <h1 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
            {product.titulo}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {product.descricao}
          </p>

          {itensCombo.length > 0 && (
            <div className="mt-6 rounded-2xl border border-gold/20 bg-cream-soft p-5">
              <h2 className="font-serif text-lg font-bold text-ink">
                O combo inclui:
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {itensCombo.map((i) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <span className="text-green" aria-hidden>
                      ✓
                    </span>
                    {i.titulo} ({i.num_desenhos} desenhos)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex items-end gap-3">
            <span className="text-4xl font-bold text-ink">
              {formatBRL(product.preco_centavos)}
            </span>
            <span className="pb-1 text-sm text-ink-soft">
              pagamento único • PDF
            </span>
          </div>

          <div className="mt-6">
            <BuyButton
              productId={product.id}
              titulo={product.titulo}
              precoCentavos={product.preco_centavos}
              label="Comprar agora"
              className="w-full sm:w-auto"
            />
          </div>

          <ul className="mt-8 space-y-2 border-t border-gold/15 pt-6 text-sm text-ink-soft">
            {inclui.map((i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="text-gold-dark" aria-hidden>
                  ✓
                </span>
                {i}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-ink-soft">
            🔒 Pagamento seguro via Mercado Pago (Pix e cartão). Você recebe o
            link de download por e-mail assim que o pagamento for confirmado.
          </p>
        </div>
      </div>

      {amostras.length > 0 && (
        <section className="mt-14 border-t border-gold/15 pt-12">
          <h2 className="font-serif text-2xl font-bold text-ink">
            Amostras deste livro
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Algumas páginas para você ver o estilo — o livro traz{" "}
            {product.num_desenhos} desenhos no total.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {amostras.map((a) => (
              <figure
                key={a.src}
                className="overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm"
              >
                <div className="relative aspect-3/2 w-full">
                  <Image
                    src={a.src}
                    alt={`Amostra — ${a.label}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                    className="object-contain p-2"
                  />
                </div>
                <figcaption className="px-3 pb-3 pt-1 text-center text-sm font-medium text-ink-soft">
                  {a.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
