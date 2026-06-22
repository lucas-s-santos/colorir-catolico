import { NextResponse } from "next/server";
import { serverEnv, supabaseConfigured } from "@/lib/config";
import {
  validateDownload,
  consumeDownload,
  createSignedDownloadUrl,
  downloadFileBytes,
} from "@/lib/download";
import { stampEmailFooter } from "@/lib/pdf/watermark";

export const runtime = "nodejs";

type Params = Promise<{ token: string }>;

export async function GET(
  req: Request,
  { params }: { params: Params },
) {
  const { token } = await params;

  if (!supabaseConfigured) {
    return new NextResponse("Serviço indisponível.", { status: 503 });
  }

  const pageUrl = new URL(`/download/${token}`, req.url);

  // 1) Valida o token (existência, pago, validade, limite).
  const v = await validateDownload(token);
  if (v.status !== "ok") {
    // invalid | expired | unpaid | exhausted -> volta à página com o estado correto
    return NextResponse.redirect(pageUrl);
  }

  // 2) Seleciona o arquivo e confere que pertence a este pedido.
  const fileParam = new URL(req.url).searchParams.get("file");
  const file = fileParam
    ? v.files.find((f) => f.path === fileParam)
    : v.files.length === 1
      ? v.files[0]
      : undefined;
  if (!file) {
    return NextResponse.redirect(pageUrl);
  }

  // 3) Consome 1 download (atômico). Se esgotou/perdeu corrida, volta à página.
  const restantes = await consumeDownload(token);
  if (restantes === null) {
    return NextResponse.redirect(pageUrl);
  }

  // 4) Entrega: com watermark (bytes) ou via URL assinada temporária.
  try {
    if (serverEnv().WATERMARK_ENABLED) {
      const bytes = await downloadFileBytes(file.path);
      const stamped = await stampEmailFooter(bytes, v.order.email_cliente);
      const nome = file.path.split("/").pop() ?? "livro.pdf";
      return new NextResponse(Buffer.from(stamped), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${nome}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const signedUrl = await createSignedDownloadUrl(file.path);
    return NextResponse.redirect(signedUrl);
  } catch (e) {
    console.error("[download] erro ao servir arquivo:", e);
    return NextResponse.redirect(pageUrl);
  }
}
