import { requireAdmin } from "@/lib/admin-auth";
import { listAllProducts } from "@/lib/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { updateProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProdutos() {
  await requireAdmin();
  const produtos = await listAllProducts();

  return (
    <>
      <AdminNav />
      <div className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold text-ink">Produtos e preços</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Edite título, descrição, preço e disponibilidade. As capas e PDFs são
          gerenciados no Supabase Storage (veja o README).
        </p>

        <div className="mt-6 space-y-5">
          {produtos.map((p) => (
            <form
              key={p.id}
              action={updateProductAction}
              className="rounded-2xl border border-gold/20 bg-cream-soft p-5"
            >
              <input type="hidden" name="id" value={p.id} />
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-dark">
                  {p.tipo === "combo" ? "Combo" : "Livro"} · {p.slug}
                </span>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="checkbox"
                    name="ativo"
                    defaultChecked={p.ativo}
                    className="h-4 w-4 accent-gold"
                  />
                  Ativo
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-ink">Título</span>
                  <input
                    name="titulo"
                    defaultValue={p.titulo}
                    className="w-full rounded-lg border border-gold/30 bg-white px-3 py-2 text-ink outline-none ring-gold/30 focus:ring-2"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-ink">
                      Preço (R$)
                    </span>
                    <input
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={(p.preco_centavos / 100).toFixed(2)}
                      className="w-full rounded-lg border border-gold/30 bg-white px-3 py-2 text-ink outline-none ring-gold/30 focus:ring-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-ink">
                      Nº desenhos
                    </span>
                    <input
                      name="num_desenhos"
                      type="number"
                      min="0"
                      defaultValue={p.num_desenhos}
                      className="w-full rounded-lg border border-gold/30 bg-white px-3 py-2 text-ink outline-none ring-gold/30 focus:ring-2"
                    />
                  </label>
                </div>
              </div>

              <label className="mt-4 block text-sm">
                <span className="mb-1 block font-medium text-ink">Descrição</span>
                <textarea
                  name="descricao"
                  defaultValue={p.descricao}
                  rows={3}
                  className="w-full rounded-lg border border-gold/30 bg-white px-3 py-2 text-ink outline-none ring-gold/30 focus:ring-2"
                />
              </label>

              <div className="mt-4 flex justify-end">
                <button className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark">
                  Salvar
                </button>
              </div>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
