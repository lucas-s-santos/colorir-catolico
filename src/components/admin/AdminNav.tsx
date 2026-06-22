import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";

export function AdminNav() {
  return (
    <header className="border-b border-gold/15 bg-cream-soft">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <span className="font-serif font-bold text-ink">
            Admin · Ateliê Católico
          </span>
          <nav className="flex gap-4 text-sm text-ink-soft">
            <Link href="/admin" className="hover:text-gold-dark">
              Pedidos
            </Link>
            <Link href="/admin/produtos" className="hover:text-gold-dark">
              Produtos
            </Link>
            <Link href="/" className="hover:text-gold-dark">
              Ver site ↗
            </Link>
          </nav>
        </div>
        <form action={signOutAction}>
          <button className="text-sm font-medium text-ink-soft transition-colors hover:text-wine">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
