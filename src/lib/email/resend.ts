import "server-only";
import { Resend } from "resend";
import { serverEnv, emailConfigured } from "@/lib/config";

interface DownloadEmailParams {
  to: string;
  productTitle: string;
  downloadUrl: string;
}

function buildHtml({ productTitle, downloadUrl }: DownloadEmailParams): string {
  const env = serverEnv();
  return `
  <div style="margin:0;padding:0;background:#faf4e8;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf4e8;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fdfaf3;border:1px solid rgba(194,150,44,0.3);border-radius:16px;overflow:hidden;">
          <tr><td style="background:#20395c;height:6px;"></td></tr>
          <tr><td style="padding:32px 32px 8px;text-align:center;">
            <p style="margin:0;color:#98731d;font-size:13px;letter-spacing:3px;text-transform:uppercase;">Ateliê Católico Digital</p>
            <h1 style="margin:12px 0 0;color:#2b2118;font-size:26px;">Seu livro está pronto! 🎉</h1>
          </td></tr>
          <tr><td style="padding:8px 32px;text-align:center;color:#6b5d4a;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;">
            <p>Recebemos seu pagamento de <strong style="color:#2b2118;">${productTitle}</strong>. É só clicar no botão abaixo para baixar:</p>
          </td></tr>
          <tr><td style="padding:16px 32px 8px;text-align:center;">
            <a href="${downloadUrl}" style="display:inline-block;background:#c2962c;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:9999px;">Baixar meu livro</a>
          </td></tr>
          <tr><td style="padding:8px 32px 28px;text-align:center;color:#6b5d4a;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;">
            <p>O link vale por <strong>${env.DOWNLOAD_EXPIRES_DAYS} dias</strong> e permite até <strong>${env.DOWNLOAD_MAX} downloads</strong>.</p>
            <p style="word-break:break-all;color:#98731d;">${downloadUrl}</p>
          </td></tr>
          <tr><td style="padding:18px 32px;background:#f4e8cf;text-align:center;color:#6b5d4a;font-family:Arial,sans-serif;font-size:12px;">
            <p style="margin:0;">Evangelizando com cor e arte 🙏</p>
            <p style="margin:6px 0 0;">Precisa de ajuda? É só responder este e-mail.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
}

/** Envia o e-mail com o link de download. No-op (loga) se o Resend não estiver configurado. */
export async function sendDownloadEmail(params: DownloadEmailParams): Promise<void> {
  if (!emailConfigured()) {
    console.warn(
      `[email] Resend não configurado — pulando envio para ${params.to}. Link: ${params.downloadUrl}`,
    );
    return;
  }
  const env = serverEnv();
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: params.to,
    subject: `Seu download — ${params.productTitle}`,
    html: buildHtml(params),
  });
  if (error) {
    throw new Error(`Falha ao enviar e-mail: ${JSON.stringify(error)}`);
  }
}
