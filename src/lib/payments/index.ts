import "server-only";
import { mercadoPagoProvider } from "./mercadopago";
import type { PaymentProvider } from "./provider";

// Provedor de pagamento ativo. Para trocar por Stripe no futuro, basta
// implementar a interface PaymentProvider e apontar aqui.
export const payments: PaymentProvider = mercadoPagoProvider;

export * from "./provider";
