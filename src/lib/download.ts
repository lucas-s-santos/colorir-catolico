import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/config";
import { getOrderById, getProductByIdAny } from "@/lib/orders";
import type { DownloadToken, Order, Product } from "@/lib/types";

export interface DownloadFile {
  path: string;
  title: string;
}

export type DownloadValidation =
  | { status: "invalid" }
  | { status: "expired" }
  | { status: "unpaid" }
  | {
      status: "ok" | "exhausted";
      token: DownloadToken;
      order: Order;
      product: Product;
      files: DownloadFile[];
    };

/** Cria um token de download com validade e limite definidos por env. */
export async function createDownloadToken(
  orderId: string,
): Promise<DownloadToken> {
  const env = serverEnv();
  const sb = createAdminClient();
  const expira = new Date(
    Date.now() + env.DOWNLOAD_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await sb
    .from("download_tokens")
    .insert({
      order_id: orderId,
      expira_em: expira,
      downloads_restantes: env.DOWNLOAD_MAX,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as DownloadToken;
}

/** Token de download mais recente de um pedido (para a tela de obrigado). */
export async function getLatestTokenForOrder(
  orderId: string,
): Promise<DownloadToken | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("download_tokens")
    .select("*")
    .eq("order_id", orderId)
    .order("criado_em", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as DownloadToken | null) ?? null;
}

async function getTokenByToken(token: string): Promise<DownloadToken | null> {
  const sb = createAdminClient();
  const { data, error } = await sb
    .from("download_tokens")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  return (data as DownloadToken | null) ?? null;
}

/** Resolve os arquivos (PDFs) de um produto — vários no caso de combo. */
export async function resolveFiles(product: Product): Promise<DownloadFile[]> {
  if (product.tipo === "combo" && product.itens_combo.length > 0) {
    const itens = await Promise.all(
      product.itens_combo.map((id) => getProductByIdAny(id)),
    );
    return itens
      .filter((p): p is Product => Boolean(p && p.arquivo_path))
      .map((p) => ({ path: p.arquivo_path as string, title: p.titulo }));
  }
  return product.arquivo_path
    ? [{ path: product.arquivo_path, title: product.titulo }]
    : [];
}

/** Valida um token: existência, pagamento, validade e limite. */
export async function validateDownload(
  token: string,
): Promise<DownloadValidation> {
  const t = await getTokenByToken(token);
  if (!t) return { status: "invalid" };
  if (new Date(t.expira_em).getTime() < Date.now()) return { status: "expired" };

  const order = await getOrderById(t.order_id);
  if (!order) return { status: "invalid" };
  if (order.status !== "pago") return { status: "unpaid" };

  const product = await getProductByIdAny(order.product_id);
  if (!product) return { status: "invalid" };

  const files = await resolveFiles(product);
  const status = t.downloads_restantes <= 0 ? "exhausted" : "ok";
  return { status, token: t, order, product, files };
}

/**
 * Consome 1 download de forma atômica (compare-and-swap).
 * Retorna o nº restante após o consumo, ou null se já estava esgotado
 * (ou perdeu a corrida com outra requisição concorrente).
 */
export async function consumeDownload(token: string): Promise<number | null> {
  const sb = createAdminClient();
  const { data: atual, error: e1 } = await sb
    .from("download_tokens")
    .select("downloads_restantes")
    .eq("token", token)
    .maybeSingle();
  if (e1) throw e1;
  if (!atual || atual.downloads_restantes <= 0) return null;

  const { data: upd, error: e2 } = await sb
    .from("download_tokens")
    .update({ downloads_restantes: atual.downloads_restantes - 1 })
    .eq("token", token)
    .eq("downloads_restantes", atual.downloads_restantes) // CAS
    .select("downloads_restantes")
    .maybeSingle();
  if (e2) throw e2;
  return upd ? (upd.downloads_restantes as number) : null;
}

/** Gera uma URL assinada e temporária para um PDF do bucket privado. */
export async function createSignedDownloadUrl(path: string): Promise<string> {
  const env = serverEnv();
  const sb = createAdminClient();
  const { data, error } = await sb.storage
    .from("pdfs")
    .createSignedUrl(path, env.SIGNED_URL_TTL_SECONDS, { download: true });
  if (error || !data?.signedUrl) {
    throw new Error(`Falha ao gerar URL assinada: ${error?.message ?? "?"}`);
  }
  return data.signedUrl;
}

/** Baixa os bytes de um PDF do bucket privado (para watermark). */
export async function downloadFileBytes(path: string): Promise<Uint8Array> {
  const sb = createAdminClient();
  const { data, error } = await sb.storage.from("pdfs").download(path);
  if (error || !data) {
    throw new Error(`Falha ao baixar arquivo: ${error?.message ?? "?"}`);
  }
  return new Uint8Array(await data.arrayBuffer());
}
