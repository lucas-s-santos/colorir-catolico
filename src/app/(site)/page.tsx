import { getActiveProducts, splitCatalog } from "@/lib/products";
import { Hero } from "@/components/landing/Hero";
import { Guarantee } from "@/components/landing/Guarantee";
import { BooksSection } from "@/components/landing/BooksSection";
import { ComboSection } from "@/components/landing/ComboSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { Faq } from "@/components/landing/Faq";
import { Reveal } from "@/components/motion/Reveal";

// ISR: o catálogo vem do banco e é revalidado periodicamente.
export const revalidate = 300;

export default async function LandingPage() {
  const produtos = await getActiveProducts();
  const { livros, combos } = splitCatalog(produtos);
  const combo = combos[0];

  return (
    <>
      <Hero livros={livros} />
      <Reveal>
        <Guarantee />
      </Reveal>
      <Reveal>
        <BooksSection livros={livros} />
      </Reveal>
      {combo && (
        <Reveal>
          <ComboSection combo={combo} livros={livros} />
        </Reveal>
      )}
      <Reveal>
        <PreviewSection />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
    </>
  );
}
