import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gold/15 bg-cream-soft">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className="font-serif text-lg font-bold text-ink">
                Ateliê Católico Digital
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Evangelizando com cor e arte. Desenhos prontos para imprimir e
              colorir, para famílias, catequese e momentos de fé.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-ink-soft">
            <Link href="/#livros" className="hover:text-gold-dark">
              Livros
            </Link>
            <Link href="/privacidade" className="hover:text-gold-dark">
              Privacidade (LGPD)
            </Link>
            <Link href="/#combo" className="hover:text-gold-dark">
              Combo completo
            </Link>
            <Link href="/reembolso" className="hover:text-gold-dark">
              Reembolso
            </Link>
            <Link href="/#perguntas" className="hover:text-gold-dark">
              Perguntas frequentes
            </Link>
            <Link href="/termos" className="hover:text-gold-dark">
              Termos de uso
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gold/15 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} Ateliê Católico Digital. Todos os direitos reservados.</p>
          <p>Pagamento seguro via Kiwify • Pix, cartão e boleto • Acesso imediato</p>
        </div>
      </div>
    </footer>
  );
}
