import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Product } from "@/lib/types";

export interface OrderRow extends Order {
  product_titulo: string | null;
}

/** Lista os pedidos (mais recentes primeiro) com o título do produto. */
export async function listOrders(limit = 200): Promise<OrderRow[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("orders")
    .select("*, products(titulo)")
    .order("criado_em", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((o) => {
    const { products, ...rest } = o as Order & {
      products: { titulo: string } | null;
    };
    return { ...(rest as Order), product_titulo: products?.titulo ?? null };
  });
}

/** Resumo para o topo do dashboard. */
export async function ordersSummary() {
  const rows = await listOrders(500);
  const pagos = rows.filter((o) => o.status === "pago");
  const receitaCentavos = pagos.reduce((s, o) => s + o.valor_centavos, 0);
  return {
    total: rows.length,
    pagos: pagos.length,
    pendentes: rows.filter((o) => o.status === "pendente").length,
    receitaCentavos,
  };
}

/** Lista TODOS os produtos (inclusive inativos), para o admin. */
export async function listAllProducts(): Promise<Product[]> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .order("ordem", { ascending: true });
  if (error) throw error;
  return data as Product[];
}

/** Atualiza campos editáveis de um produto. */
export async function updateProduct(
  id: string,
  fields: Partial<
    Pick<
      Product,
      "titulo" | "descricao" | "preco_centavos" | "num_desenhos" | "ativo"
    >
  >,
): Promise<void> {
  const sb = createAdminClient();
  const { error } = await sb.from("products").update(fields).eq("id", id);
  if (error) throw error;
}
