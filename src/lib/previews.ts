// Amostras reais (páginas dos livros) usadas nas prévias do site.
// Os arquivos ficam em /public/amostras/<slug>/ e são servidos estaticamente.

export interface PreviewImage {
  src: string;
  label: string;
}

const grandesMomentosDaFe: PreviewImage[] = [
  {
    src: "/amostras/grandes-momentos-da-fe/jesus-e-as-criancas.jpg",
    label: "Jesus e as crianças",
  },
  {
    src: "/amostras/grandes-momentos-da-fe/o-nascimento-de-jesus.jpg",
    label: "O nascimento de Jesus",
  },
  {
    src: "/amostras/grandes-momentos-da-fe/o-bom-pastor.jpg",
    label: "O Bom Pastor",
  },
  {
    src: "/amostras/grandes-momentos-da-fe/nossa-senhora.jpg",
    label: "Nossa Senhora com o Menino",
  },
];

const vidaDosSantosEMilagres: PreviewImage[] = [
  {
    src: "/amostras/vida-dos-santos-e-milagres/sao-francisco.jpg",
    label: "São Francisco e os animais",
  },
  {
    src: "/amostras/vida-dos-santos-e-milagres/santo-antonio.jpg",
    label: "Santo Antônio",
  },
  {
    src: "/amostras/vida-dos-santos-e-milagres/nossa-senhora.jpg",
    label: "Nossa Senhora",
  },
  {
    src: "/amostras/vida-dos-santos-e-milagres/santo-em-oracao.jpg",
    label: "Santo em oração",
  },
];

/** Amostras por slug de produto (para a página de cada livro). */
export const PREVIEWS: Record<string, PreviewImage[]> = {
  "grandes-momentos-da-fe": grandesMomentosDaFe,
  "vida-dos-santos-e-milagres": vidaDosSantosEMilagres,
};

/** Amostras de um livro (vazio se não houver). */
export function getPreviews(slug: string): PreviewImage[] {
  return PREVIEWS[slug] ?? [];
}

/** Mix intercalado dos livros, para a vitrine da landing. */
export const LANDING_PREVIEWS: PreviewImage[] = grandesMomentosDaFe.flatMap(
  (img, i) => {
    const outro = vidaDosSantosEMilagres[i];
    return outro ? [img, outro] : [img];
  },
);
