import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Coupon } from "@/lib/types";

export interface CouponPreview {
  codigo: string;
  descontoPercent: number;
  valorComDesconto: number;
}

/** Valida um cupom e calcula o valor com desconto (sem efetivar o uso). */
export async function previewCoupon(
  code: string,
  valorCentavos: number,
): Promise<CouponPreview | null> {
  const codigo = code.trim().toUpperCase();
  if (!codigo) return null;

  const sb = createAdminClient();
  const { data, error } = await sb
    .from("coupons")
    .select("*")
    .eq("codigo", codigo)
    .maybeSingle();
  if (error) throw error;

  const c = data as Coupon | null;
  if (!c || !c.ativo) return null;
  if (c.validade && new Date(c.validade).getTime() < Date.now()) return null;
  if (c.usos_restantes !== null && c.usos_restantes <= 0) return null;

  const desconto = Math.round((valorCentavos * c.desconto_percent) / 100);
  return {
    codigo,
    descontoPercent: c.desconto_percent,
    valorComDesconto: Math.max(valorCentavos - desconto, 0),
  };
}

/** Efetiva o uso de um cupom (decrementa usos_restantes, se limitado). */
export async function consumeCoupon(codigo: string): Promise<void> {
  const sb = createAdminClient();
  const { data } = await sb
    .from("coupons")
    .select("usos_restantes")
    .eq("codigo", codigo)
    .maybeSingle();
  if (!data || data.usos_restantes === null || data.usos_restantes <= 0) return;
  await sb
    .from("coupons")
    .update({ usos_restantes: data.usos_restantes - 1 })
    .eq("codigo", codigo)
    .eq("usos_restantes", data.usos_restantes); // CAS
}
