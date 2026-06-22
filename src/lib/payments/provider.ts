// Contrato de provedor de pagamento — abstrai o Mercado Pago (e permite trocar
// por Stripe no futuro sem mexer no resto do sistema).

export interface CreateCheckoutParams {
  orderId: string; // usado como external_reference
  productId: string;
  title: string;
  amountCentavos: number;
  payerEmail: string;
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
  notificationUrl: string;
}

export interface CheckoutResult {
  /** URL para onde redirecionar o cliente (checkout hospedado). */
  checkoutUrl: string;
  /** Id da preferência/sessão no provedor (guardado no pedido). */
  providerReference: string;
}

export type PaymentStatus =
  | "approved"
  | "pending"
  | "in_process"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "charged_back"
  | "unknown";

export interface PaymentInfo {
  id: string;
  status: PaymentStatus;
  approved: boolean;
  externalReference: string | null;
  amountCentavos: number | null;
  payerEmail: string | null;
}

export interface VerifyWebhookInput {
  signatureHeader: string | null; // header x-signature
  requestId: string | null; // header x-request-id
  dataId: string; // id recebido na notificação (data.id)
}

export interface PaymentProvider {
  readonly name: string;
  /** Cria a sessão de checkout e devolve a URL de redirecionamento. */
  createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult>;
  /** Consulta um pagamento na API do provedor (fonte da verdade). */
  getPayment(paymentId: string): Promise<PaymentInfo>;
  /** Valida a assinatura do webhook. */
  verifyWebhookSignature(input: VerifyWebhookInput): boolean;
}
