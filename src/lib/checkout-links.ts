// Links de checkout da Kiwify, por produto (slug -> URL do checkout).
// Quando criar um novo produto na Kiwify, cole o link aqui.
// Se um slug não tiver link, o botão "Comprar" aparece como "Em breve".

export const CHECKOUT_LINKS: Record<string, string> = {
  "grandes-momentos-da-fe": "https://pay.kiwify.com.br/2VzqZBZ",
  "vida-dos-santos-e-milagres": "https://pay.kiwify.com.br/Hz7u4G3",
  "cenas-biblicas-e-sacramentos": "https://pay.kiwify.com.br/v08qc0i",
  // "combo-3-livros": "",  // <- adicionar quando criar o combo na Kiwify
};

/** Link de checkout de um produto (null se ainda não cadastrado). */
export function getCheckoutLink(slug: string): string | null {
  return CHECKOUT_LINKS[slug] ?? null;
}
