import { NextResponse } from "next/server";
import { payments } from "@/lib/payments";
import { markOrderPaid } from "@/lib/orders";
import { fulfillOrder } from "@/lib/fulfillment";
import { consumeCoupon } from "@/lib/coupons";
import { supabaseConfigured, paymentsConfigured } from "@/lib/config";

export const runtime = "nodejs";

// MP envia notificações deste endpoint. Sempre respondemos rápido:
//  - 200 quando tratado (ou quando não há nada a fazer);
//  - 401 se a assinatura for inválida;
//  - 500 em erro interno (MP tentará reenviar).
export async function POST(req: Request) {
  if (!supabaseConfigured || !paymentsConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const signatureHeader = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  const url = new URL(req.url);

  let body: {
    type?: string;
    topic?: string;
    action?: string;
    data?: { id?: string | number };
  } = {};
  try {
    body = await req.json();
  } catch {
    // notificação pode vir só por query string
  }

  const type =
    body.type ??
    body.topic ??
    url.searchParams.get("type") ??
    url.searchParams.get("topic");
  const dataId =
    body.data?.id ??
    url.searchParams.get("data.id") ??
    url.searchParams.get("id");

  // Só tratamos pagamentos.
  if (type && type !== "payment") return NextResponse.json({ ok: true });
  if (!dataId) return NextResponse.json({ ok: true });

  // 1) Valida a assinatura (não confiar só no payload).
  const valid = payments.verifyWebhookSignature({
    signatureHeader,
    requestId,
    dataId: String(dataId),
  });
  if (!valid) {
    console.warn("[webhook] assinatura inválida para data.id", dataId);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  try {
    // 2) Reconsulta o pagamento na API (fonte da verdade).
    const payment = await payments.getPayment(String(dataId));
    if (!payment.approved || !payment.externalReference) {
      return NextResponse.json({ ok: true });
    }

    // 3) Marca como pago (idempotente).
    const result = await markOrderPaid(payment.externalReference, payment.id);
    if (!result) return NextResponse.json({ ok: true });

    // 4) Apenas na primeira confirmação: gera token + envia e-mail (+ cupom).
    if (result.justPaid) {
      await fulfillOrder(result.order);
      if (result.order.coupon_codigo) {
        await consumeCoupon(result.order.coupon_codigo);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[webhook] erro:", e);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
