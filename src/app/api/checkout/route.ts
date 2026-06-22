import { NextResponse } from "next/server";
import { z } from "zod";
import { siteUrl, supabaseConfigured, paymentsConfigured } from "@/lib/config";
import {
  createPendingOrder,
  getActiveProductById,
  setOrderPreference,
} from "@/lib/orders";
import { payments } from "@/lib/payments";
import { previewCoupon } from "@/lib/coupons";

export const runtime = "nodejs";

const Body = z.object({
  productId: z.string().uuid(),
  email: z.string().email(),
  coupon: z.string().trim().max(40).optional(),
});

export async function POST(req: Request) {
  // Degrada com elegância se as integrações ainda não estiverem configuradas.
  if (!supabaseConfigured || !paymentsConfigured()) {
    return NextResponse.json(
      { error: "Pagamento em configuração. Volte em instantes." },
      { status: 501 },
    );
  }

  let parsed;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Dados inválidos. Verifique o e-mail e tente novamente." },
      { status: 400 },
    );
  }

  try {
    const product = await getActiveProductById(parsed.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 },
      );
    }

    // O valor é sempre definido no servidor (nunca confiar no cliente).
    let valorCentavos = product.preco_centavos;
    let couponCodigo: string | null = null;
    if (parsed.coupon) {
      const cp = await previewCoupon(parsed.coupon, valorCentavos);
      if (cp) {
        valorCentavos = cp.valorComDesconto;
        couponCodigo = cp.codigo;
      }
    }

    const order = await createPendingOrder({
      productId: product.id,
      email: parsed.email,
      valorCentavos,
      couponCodigo,
    });

    const checkout = await payments.createCheckout({
      orderId: order.id,
      productId: product.id,
      title: product.titulo,
      amountCentavos: valorCentavos,
      payerEmail: parsed.email,
      successUrl: `${siteUrl}/obrigado?order=${order.id}`,
      pendingUrl: `${siteUrl}/obrigado?order=${order.id}`,
      failureUrl: `${siteUrl}/produto/${product.slug}`,
      notificationUrl: `${siteUrl}/api/webhook/mercadopago`,
    });

    await setOrderPreference(order.id, checkout.providerReference);

    return NextResponse.json({
      init_point: checkout.checkoutUrl,
      orderId: order.id,
    });
  } catch (e) {
    console.error("[checkout] erro:", e);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 500 },
    );
  }
}
