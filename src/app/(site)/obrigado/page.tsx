import type { Metadata } from "next";
import Link from "next/link";
import { supabaseConfigured } from "@/lib/config";
import { getOrderById } from "@/lib/orders";
import { getLatestTokenForOrder } from "@/lib/download";

export const metadata: Metadata = { title: "Obrigada pela sua compra" };
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ order?: string }>;

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { order: orderId } = await searchParams;

  const order =
    orderId && supabaseConfigured ? await getOrderById(orderId) : null;
  const token =
    order?.status === "pago" ? await getLatestTokenForOrder(order.id) : null;

  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-8">
      {order?.status === "pago" ? (
        <>
          <div className="text-5xl" aria-hidden>
            🎉
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            Pagamento confirmado!
          </h1>
          <p className="mt-4 text-ink-soft">
            Enviamos o link de download para <strong>{order.email_cliente}</strong>.
            Você também pode acessar agora mesmo:
          </p>
          {token ? (
            <Link
              href={`/download/${token.token}`}
              className="mt-6 inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark"
            >
              Acessar meus downloads
            </Link>
          ) : (
            <p className="mt-6 text-sm text-ink-soft">
              Seu link estará no e-mail. Se não chegar em alguns minutos, confira
              o spam ou fale conosco.
            </p>
          )}
        </>
      ) : order?.status === "cancelado" ? (
        <>
          <h1 className="text-3xl font-bold text-ink">Pagamento não concluído</h1>
          <p className="mt-4 text-ink-soft">
            Parece que o pagamento não foi finalizado. Você pode tentar
            novamente quando quiser.
          </p>
          <Link
            href="/#livros"
            className="mt-6 inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-white hover:bg-gold-dark"
          >
            Voltar aos livros
          </Link>
        </>
      ) : (
        <>
          <div className="text-5xl" aria-hidden>
            🙏
          </div>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            Obrigada pela sua compra!
          </h1>
          <p className="mt-4 text-ink-soft">
            {order
              ? "Estamos confirmando seu pagamento. No Pix isso costuma levar poucos minutos. Assim que confirmar, você recebe o link por e-mail — e ele aparece aqui também."
              : "Assim que o pagamento for confirmado, enviaremos o link de download para o seu e-mail."}
          </p>
          {order && (
            <Link
              href={`/obrigado?order=${order.id}`}
              className="mt-6 inline-flex rounded-full border border-gold/40 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold/10"
            >
              Atualizar status
            </Link>
          )}
        </>
      )}
    </div>
  );
}
