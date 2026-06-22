import "server-only";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order, Product } from "@/lib/types";

/** Busca um produto ATIVO por id (via service role). */
export async function getActiveProductById(id: string): Promise<Product | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("ativo", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Product | null) ?? null;
}

/** Cria um pedido PENDENTE. external_reference = id (para casar no webhook). */
export async function createPendingOrder(params: {
  productId: string;
  email: string;
  valorCentavos: number;
  couponCodigo?: string | null;
}): Promise<Order> {
  const sb = createAdminClient();
  const id = randomUUID();
  const { data, error } = await sb
    .from("orders")
    .insert({
      id,
      external_reference: id,
      email_cliente: params.email,
      product_id: params.productId,
      valor_centavos: params.valorCentavos,
      coupon_codigo: params.couponCodigo ?? null,
      status: "pendente",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Order;
}

/** Guarda o id da preferência do provedor no pedido. */
export async function setOrderPreference(
  orderId: string,
  preferenceId: string,
): Promise<void> {
  const sb = createAdminClient();
  const { error } = await sb
    .from("orders")
    .update({ mp_preference_id: preferenceId })
    .eq("id", orderId);
  if (error) throw error;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Order | null) ?? null;
}

/** Produto por id, mesmo inativo (para download/e-mail de pedidos antigos). */
export async function getProductByIdAny(id: string): Promise<Product | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Product | null) ?? null;
}

/**
 * Marca o pedido como PAGO de forma IDEMPOTENTE.
 * Só transiciona de 'pendente' -> 'pago' (a cláusula eq garante atomicidade:
 * em webhooks duplicados, apenas o primeiro update casa).
 * Retorna { justPaid } indicando se ESTA chamada efetivou o pagamento.
 */
export async function markOrderPaid(
  orderId: string,
  paymentId: string,
): Promise<{ justPaid: boolean; order: Order } | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("orders")
    .update({
      status: "pago",
      pago_em: new Date().toISOString(),
      mp_payment_id: paymentId,
    })
    .eq("id", orderId)
    .eq("status", "pendente")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (data) return { justPaid: true, order: data as Order };

  // Já estava pago (ou inexistente).
  const existing = await getOrderById(orderId);
  return existing ? { justPaid: false, order: existing } : null;
}
