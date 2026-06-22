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

const cenasBiblicasESacramentos: PreviewImage[] = [
  {
    src: "/amostras/cenas-biblicas-e-sacramentos/a-criacao.jpg",
    label: "A criação",
  },
  {
    src: "/amostras/cenas-biblicas-e-sacramentos/as-bodas-de-cana.jpg",
    label: "As bodas de Caná",
  },
  {
    src: "/amostras/cenas-biblicas-e-sacramentos/o-bom-samaritano.jpg",
    label: "O bom samaritano",
  },
  {
    src: "/amostras/cenas-biblicas-e-sacramentos/a-uncao-dos-enfermos.jpg",
    label: "A unção dos enfermos",
  },
];

/** Amostras por slug de produto (para a página de cada livro). */
export const PREVIEWS: Record<string, PreviewImage[]> = {
  "grandes-momentos-da-fe": grandesMomentosDaFe,
  "vida-dos-santos-e-milagres": vidaDosSantosEMilagres,
  "cenas-biblicas-e-sacramentos": cenasBiblicasESacramentos,
};

/** Amostras de um livro (vazio se não houver). */
export function getPreviews(slug: string): PreviewImage[] {
  return PREVIEWS[slug] ?? [];
}

/** Mix intercalado dos 3 livros, para a vitrine da landing. */
const livrosParaVitrine = [
  grandesMomentosDaFe,
  vidaDosSantosEMilagres,
  cenasBiblicasESacramentos,
];

export const LANDING_PREVIEWS: PreviewImage[] = (() => {
  const out: PreviewImage[] = [];
  const max = Math.max(...livrosParaVitrine.map((l) => l.length));
  for (let i = 0; i < max; i++) {
    for (const livro of livrosParaVitrine) {
      const img = livro[i];
      if (img) out.push(img);
    }
  }
  return out;
})();
