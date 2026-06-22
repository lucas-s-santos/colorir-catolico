import { requireAdmin } from "@/lib/admin-auth";
import { listOrders, ordersSummary } from "@/lib/admin";
import { formatBRL, formatDateTimeBR } from "@/lib/format";
import { AdminNav } from "@/components/admin/AdminNav";
import { resendEmailAction } from "./actions";

export const dynamic = "force-dynamic";

const statusBadge: Record<string, string> = {
  pago: "bg-green/15 text-green",
  pendente: "bg-gold/15 text-gold-dark",
  cancelado: "bg-wine/15 text-wine",
};

export default async function AdminDashboard() {
  await requireAdmin();
  const [resumo, pedidos] = await Promise.all([ordersSummary(), listOrders()]);

  return (
    <>
      <AdminNav />
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <h1 className="text-2xl font-bold text-ink">Pedidos</h1>

        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card label="Pedidos" value={String(resumo.total)} />
          <Card label="Pagos" value={String(resumo.pagos)} />
          <Card label="Pendentes" value={String(resumo.pendentes)} />
          <Card label="Receita (paga)" value={formatBRL(resumo.receitaCentavos)} />
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-gold/20 bg-cream-soft">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-gold/15 text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {pedidos.map((p) => (
                <tr key={p.id} className="text-ink">
                  <td className="px-4 py-3 whitespace-nowrap text-ink-soft">
                    {formatDateTimeBR(p.criado_em)}
                  </td>
                  <td className="px-4 py-3">{p.email_cliente}</td>
                  <td className="px-4 py-3">{p.product_titulo ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatBRL(p.valor_centavos)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusBadge[p.status] ?? ""
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "pago" ? (
                      <form action={resendEmailAction}>
                        <input type="hidden" name="orderId" value={p.id} />
                        <button className="rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gold/10">
                          Reenviar e-mail
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-ink-soft">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {pedidos.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                    Nenhum pedido ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-cream-soft p-4">
      <p className="text-xs uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
