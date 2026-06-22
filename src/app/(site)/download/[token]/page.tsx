import type { Metadata } from "next";
import Link from "next/link";
import { validateDownload } from "@/lib/download";
import { formatDateTimeBR } from "@/lib/format";

export const metadata: Metadata = { title: "Meus downloads" };
export const dynamic = "force-dynamic";

type Params = Promise<{ token: string }>;

function Aviso({
  titulo,
  texto,
}: {
  titulo: string;
  texto: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center sm:px-8">
      <h1 className="text-2xl font-bold text-ink">{titulo}</h1>
      <p className="mt-4 text-ink-soft">{texto}</p>
      <Link
        href="/#perguntas"
        className="mt-6 inline-flex rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold/10"
      >
        Precisa de ajuda?
      </Link>
    </div>
  );
}

export default async function DownloadPage({ params }: { params: Params }) {
  const { token } = await params;
  const v = await validateDownload(token);

  if (v.status === "invalid")
    return (
      <Aviso
        titulo="Link inválido"
        texto="Não encontramos este link de download. Confira o e-mail que enviamos ou fale conosco."
      />
    );
  if (v.status === "expired")
    return (
      <Aviso
        titulo="Link expirado"
        texto="Este link de download passou da validade. Fale conosco que reenviamos um novo acesso."
      />
    );
  if (v.status === "unpaid")
    return (
      <Aviso
        titulo="Pagamento ainda não confirmado"
        texto="Assim que o pagamento for confirmado, seu download será liberado automaticamente."
      />
    );
  if (v.status === "exhausted")
    return (
      <Aviso
        titulo="Limite de downloads atingido"
        texto="Este link já atingiu o número máximo de downloads. Se precisar, fale conosco para liberar um novo acesso."
      />
    );

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
      <div className="text-center">
        <div className="text-4xl" aria-hidden>
          📥
        </div>
        <h1 className="mt-3 text-3xl font-bold text-ink">Seus arquivos</h1>
        <p className="mt-2 text-ink-soft">
          Compra de <strong>{v.product.titulo}</strong> · {v.order.email_cliente}
        </p>
      </div>

      <div className="mt-8 divide-y divide-gold/15 overflow-hidden rounded-2xl border border-gold/20 bg-cream-soft">
        {v.files.map((f) => (
          <div
            key={f.path}
            className="flex items-center justify-between gap-4 p-4 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl" aria-hidden>
                📄
              </span>
              <span className="font-medium text-ink">{f.title}</span>
            </div>
            <a
              href={`/api/download/${token}?file=${encodeURIComponent(f.path)}`}
              className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gold-dark"
            >
              Baixar PDF
            </a>
          </div>
        ))}
        {v.files.length === 0 && (
          <p className="p-5 text-center text-sm text-ink-soft">
            Os arquivos deste pedido ainda não foram cadastrados. Fale conosco
            que resolvemos rapidinho.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-1 text-center text-sm text-ink-soft">
        <p>
          Downloads restantes: <strong>{v.token.downloads_restantes}</strong>
        </p>
        <p>Link válido até {formatDateTimeBR(v.token.expira_em)}.</p>
      </div>
    </div>
  );
}
