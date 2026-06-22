import type { Product } from "@/lib/types";
import { BookCard } from "./BookCard";
import { SectionHeading } from "./SectionHeading";

export function BooksSection({ livros }: { livros: Product[] }) {
  return (
    <section id="livros" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          eyebrow="Nossos livros"
          title="Escolha seu livro de colorir"
          subtitle="Cada livro reúne ilustrações exclusivas em contorno, em PDF de alta qualidade (A4), prontas para imprimir quantas vezes quiser."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {livros.map((livro) => (
            <BookCard key={livro.id} product={livro} />
          ))}
        </div>
      </div>
    </section>
  );
}
