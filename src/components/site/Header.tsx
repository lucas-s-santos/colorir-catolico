import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-serif text-lg font-bold leading-tight text-ink sm:text-xl">
            Ateliê Católico Digital
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          <Link href="/#livros" className="transition-colors hover:text-gold-dark">
            Livros
          </Link>
          <Link href="/#combo" className="transition-colors hover:text-gold-dark">
            Combo
          </Link>
          <Link href="/#perguntas" className="transition-colors hover:text-gold-dark">
            Perguntas
          </Link>
        </nav>

        <Link
          href="/#livros"
          className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark"
        >
          Ver os livros
        </Link>
      </div>
    </header>
  );
}
