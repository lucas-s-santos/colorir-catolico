import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/**
 * Grava um rodapé discreto com o e-mail do comprador em todas as páginas,
 * para inibir compartilhamento. Acionado por WATERMARK_ENABLED.
 */
export async function stampEmailFooter(
  bytes: Uint8Array,
  email: string,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const texto = `Licenciado para ${email} · Ateliê Católico Digital`;
  const size = 8;

  for (const page of pdf.getPages()) {
    const { width } = page.getSize();
    const largura = font.widthOfTextAtSize(texto, size);
    page.drawText(texto, {
      x: Math.max((width - largura) / 2, 8),
      y: 10,
      size,
      font,
      color: rgb(0.45, 0.41, 0.34),
      opacity: 0.6,
    });
  }
  return await pdf.save();
}
