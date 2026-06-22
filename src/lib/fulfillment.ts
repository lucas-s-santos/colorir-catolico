import "server-only";
import { siteUrl } from "@/lib/config";
import { getProductByIdAny } from "@/lib/orders";
import {
  createDownloadToken,
  getLatestTokenForOrder,
} from "@/lib/download";
import { sendDownloadEmail } from "@/lib/email/resend";
import type { DownloadToken, Order } from "@/lib/types";

/**
 * Entrega o pedido: garante um token de download válido (reaproveita o último
 * se ainda estiver válido, senão cria um novo) e envia o e-mail com o link.
 * Usado pelo webhook (na 1ª confirmação) e pelo "reenviar e-mail" do admin.
 */
export async function fulfillOrder(order: Order): Promise<DownloadToken> {
  const latest = await getLatestTokenForOrder(order.id);
  const valido =
    latest &&
    new Date(latest.expira_em).getTime() > Date.now() &&
    latest.downloads_restantes > 0;

  const token = valido ? latest : await createDownloadToken(order.id);

  const product = await getProductByIdAny(order.product_id);
  await sendDownloadEmail({
    to: order.email_cliente,
    productTitle: product?.titulo ?? "Seu livro de colorir",
    downloadUrl: `${siteUrl}/download/${token.token}`,
  });

  return token;
}
