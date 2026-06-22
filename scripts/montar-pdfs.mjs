// Monta os PDFs dos livros a partir das pastas de imagens (livro1, livro2, livro3).
// Cada imagem vira uma página A4 (centralizada, mantendo a proporção).
//
// Uso:  node scripts/montar-pdfs.mjs
// Saída: ./pdfs-gerados/<slug>.pdf  (suba cada um no bucket privado "pdfs" do Supabase)

import { PDFDocument } from "pdf-lib";
import {
  readFileSync,
  readdirSync,
  writeFileSync,
  existsSync,
  mkdirSync,
} from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Raiz do projeto, independente de onde o comando é executado.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "pdfs-gerados");
const A4 = { w: 595.28, h: 841.89 }; // pontos
const MARGEM = 24;
const INCLUIR_CAPA = true; // coloca a capa como 1ª página

const LIVROS = [
  { folder: "livro1", slug: "grandes-momentos-da-fe", capa: "capa_livro1.png" },
  { folder: "livro2", slug: "vida-dos-santos-e-milagres", capa: "capa_livro2.png" },
  { folder: "livro3", slug: "cenas-biblicas-e-sacramentos", capa: "capa_livro3.png" },
];

function imagensOrdenadas(dir, capa) {
  const arquivos = readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  const desenhos = arquivos
    .filter((f) => f !== capa)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const lista = [];
  if (INCLUIR_CAPA && capa && arquivos.includes(capa)) lista.push(capa);
  lista.push(...desenhos);
  return lista;
}

async function embutir(pdf, dir, file) {
  const bytes = readFileSync(join(dir, file));
  return extname(file).toLowerCase() === ".png"
    ? pdf.embedPng(bytes)
    : pdf.embedJpg(bytes);
}

async function montar(livro) {
  const dir = join(ROOT, livro.folder);
  if (!existsSync(dir)) {
    console.warn(`• pasta "${livro.folder}" não encontrada — pulando`);
    return;
  }
  const arquivos = imagensOrdenadas(dir, livro.capa);
  if (arquivos.length === 0) {
    console.warn(`• sem imagens em "${livro.folder}" — pulando`);
    return;
  }

  const pdf = await PDFDocument.create();
  for (const file of arquivos) {
    const img = await embutir(pdf, dir, file);
    const page = pdf.addPage([A4.w, A4.h]);
    const maxW = A4.w - MARGEM * 2;
    const maxH = A4.h - MARGEM * 2;
    const escala = Math.min(maxW / img.width, maxH / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    page.drawImage(img, {
      x: (A4.w - w) / 2,
      y: (A4.h - h) / 2,
      width: w,
      height: h,
    });
  }

  if (!existsSync(OUT)) mkdirSync(OUT);
  const out = join(OUT, `${livro.slug}.pdf`);
  writeFileSync(out, await pdf.save());
  console.log(`✓ ${livro.slug}.pdf  (${arquivos.length} páginas)`);
}

for (const livro of LIVROS) {
  await montar(livro);
}
console.log(`\nPronto! PDFs gerados em: ${OUT}`);
console.log(
  'Agora suba cada arquivo no bucket privado "pdfs" do Supabase, com o nome <slug>.pdf.',
);
