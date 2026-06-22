import "server-only";
import crypto from "node:crypto";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { serverEnv } from "@/lib/config";
import type {
  CheckoutResult,
  CreateCheckoutParams,
  PaymentInfo,
  PaymentProvider,
  PaymentStatus,
  VerifyWebhookInput,
} from "./provider";

function client() {
  return new MercadoPagoConfig({
    accessToken: serverEnv().MERCADOPAGO_ACCESS_TOKEN,
  });
}

function centavosToReais(c: number): number {
  return Number((c / 100).toFixed(2));
}

function mapStatus(s?: string | null): PaymentStatus {
  switch (s) {
    case "approved":
    case "pending":
    case "in_process":
    case "rejected":
    case "cancelled":
    case "refunded":
    case "charged_back":
      return s;
    default:
      return "unknown";
  }
}

export const mercadoPagoProvider: PaymentProvider = {
  name: "mercadopago",

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    const token = serverEnv().MERCADOPAGO_ACCESS_TOKEN;
    const preference = new Preference(client());

    const res = await preference.create({
      body: {
        items: [
          {
            id: params.productId,
            title: params.title,
            quantity: 1,
            unit_price: centavosToReais(params.amountCentavos),
            currency_id: "BRL",
          },
        ],
        payer: { email: params.payerEmail },
        external_reference: params.orderId,
        notification_url: params.notificationUrl,
        back_urls: {
          success: params.successUrl,
          pending: params.pendingUrl,
          failure: params.failureUrl,
        },
        auto_return: "approved",
        statement_descriptor: "ATELIE CATOLICO",
        metadata: { order_id: params.orderId },
      },
    });

    // Com credenciais de TESTE, usa-se o sandbox_init_point.
    const isTest = token.startsWith("TEST-");
    const url = isTest
      ? res.sandbox_init_point ?? res.init_point
      : res.init_point ?? res.sandbox_init_point;

    if (!url) {
      throw new Error("Mercado Pago não retornou a URL de checkout.");
    }

    return { checkoutUrl: url, providerReference: String(res.id ?? "") };
  },

  async getPayment(paymentId: string): Promise<PaymentInfo> {
    const payment = new Payment(client());
    const p = await payment.get({ id: paymentId });
    return {
      id: String(p.id ?? paymentId),
      status: mapStatus(p.status),
      approved: p.status === "approved",
      externalReference: p.external_reference ?? null,
      amountCentavos:
        typeof p.transaction_amount === "number"
          ? Math.round(p.transaction_amount * 100)
          : null,
      payerEmail: p.payer?.email ?? null,
    };
  },

  verifyWebhookSignature({
    signatureHeader,
    requestId,
    dataId,
  }: VerifyWebhookInput): boolean {
    const secret = serverEnv().MERCADOPAGO_WEBHOOK_SECRET;
    if (!signatureHeader || !secret) return false;

    // Header no formato: "ts=1699999999,v1=<hash>"
    const parts: Record<string, string> = {};
    for (const kv of signatureHeader.split(",")) {
      const idx = kv.indexOf("=");
      if (idx === -1) continue;
      parts[kv.slice(0, idx).trim()] = kv.slice(idx + 1).trim();
    }
    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) return false;

    // Se o id for alfanumérico, normaliza para minúsculas (regra do MP).
    const id = /^[0-9]+$/.test(dataId) ? dataId : dataId.toLowerCase();
    const manifest = `id:${id};request-id:${requestId ?? ""};ts:${ts};`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(manifest)
      .digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, "hex"),
        Buffer.from(v1, "hex"),
      );
    } catch {
      return false;
    }
  },
};
