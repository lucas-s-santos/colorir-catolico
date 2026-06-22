"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getOrderById } from "@/lib/orders";
import { fulfillOrder } from "@/lib/fulfillment";
import { updateProduct } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

/** Reenvia o e-mail de download de um pedido pago. */
export async function resendEmailAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const order = await getOrderById(orderId);
  if (order && order.status === "pago") {
    await fulfillOrder(order);
  }
  revalidatePath("/admin");
}

/** Atualiza título, descrição, preço, nº de desenhos e status do produto. */
export async function updateProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const precoReais = Number(
    String(formData.get("preco") ?? "0").replace(",", "."),
  );
  await updateProduct(id, {
    titulo: String(formData.get("titulo") ?? ""),
    descricao: String(formData.get("descricao") ?? ""),
    num_desenhos: Number(formData.get("num_desenhos") ?? 0),
    preco_centavos: Math.round(precoReais * 100),
    ativo: formData.get("ativo") === "on",
  });
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

/** Encerra a sessão do admin. */
export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
