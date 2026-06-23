import { getActiveProducts, splitCatalog } from "@/lib/products";
import { Hero } from "@/components/landing/Hero";
import { Guarantee } from "@/components/landing/Guarantee";
import { BooksSection } from "@/components/landing/BooksSection";
import { ComboSection } from "@/components/landing/ComboSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { Faq } from "@/components/landing/Faq";

// ISR: o catálogo vem do banco e é revalidado periodicamente.
export const revalidate = 300;

export default async function LandingPage() {
  const produtos = await getActiveProducts();
  const { livros, combos } = splitCatalog(produtos);
  const combo = combos[0];

  return (
    <>
      <Hero livros={livros} />
      <Guarantee />
      <BooksSection livros={livros} />
      {combo && <ComboSection combo={combo} livros={livros} />}
      <PreviewSection />
      <Faq />
    </>
  );
}
