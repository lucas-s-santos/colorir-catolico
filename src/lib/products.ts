import "server-only";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/config";
import type { Product } from "@/lib/types";

/**
 * Catálogo de FALLBACK para desenvolvimento/preview enquanto o Supabase ainda
 * não está configurado (ou momentaneamente indisponível). Em produção o
 * catálogo vem 100% do banco. Mantenha em sincronia com supabase/seed.sql.
 */
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "grandes-momentos-da-fe",
    titulo: "Grandes Momentos da Fé",
    descricao:
      "Dez cenas marcadas pela presença de Deus na história da salvação — da criação à promessa cumprida. Ideal para começar a colorir a fé em família, com traços generosos e cheios de significado.",
    preco_centavos: 1490,
    capa_url: "/capas/grandes-momentos-da-fe.png",
    arquivo_path: "grandes-momentos-da-fe.pdf",
    num_desenhos: 10,
    ativo: true,
    tipo: "unico",
    itens_combo: [],
    ordem: 1,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "vida-dos-santos-e-milagres",
    titulo: "Vida dos Santos e Milagres",
    descricao:
      "Vinte desenhos que celebram a vida dos santos e os milagres que tocaram gerações. Uma forma carinhosa de apresentar exemplos de santidade às crianças, na catequese ou em casa.",
    preco_centavos: 1990,
    capa_url: "/capas/vida-dos-santos-e-milagres.png",
    arquivo_path: "vida-dos-santos-e-milagres.pdf",
    num_desenhos: 20,
    ativo: true,
    tipo: "unico",
    itens_combo: [],
    ordem: 2,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "cenas-biblicas-e-sacramentos",
    titulo: "Cenas Bíblicas e Sacramentos",
    descricao:
      "Trinta cenas bíblicas e os sacramentos da Igreja, do Batismo à Eucaristia. O álbum mais completo para momentos de oração, contemplação e convivência em família.",
    preco_centavos: 2490,
    capa_url: "/capas/cenas-biblicas-e-sacramentos.png",
    arquivo_path: "cenas-biblicas-e-sacramentos.pdf",
    num_desenhos: 30,
    ativo: true,
    tipo: "unico",
    itens_combo: [],
    ordem: 3,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    slug: "combo-3-livros",
    titulo: "Combo Completo — os 3 livros",
    descricao:
      "Os três livros juntos — Grandes Momentos da Fé, Vida dos Santos e Milagres e Cenas Bíblicas e Sacramentos — reunidos com um desconto especial. Sessenta desenhos para colorir a fé do começo ao fim.",
    preco_centavos: 4990,
    capa_url: "/capas/combo-3-livros.svg",
    arquivo_path: null,
    num_desenhos: 60,
    ativo: true,
    tipo: "combo",
    itens_combo: [
      "11111111-1111-1111-1111-111111111111",
      "22222222-2222-2222-2222-222222222222",
      "33333333-3333-3333-3333-333333333333",
    ],
    ordem: 4,
    created_at: "2026-01-01T00:00:00Z",
  },
];

function fallbackAtivos(): Product[] {
  return FALLBACK_PRODUCTS.filter((p) => p.ativo).sort(
    (a, b) => a.ordem - b.ordem,
  );
}

/** Todos os produtos ativos, ordenados para a vitrine. */
export async function getActiveProducts(): Promise<Product[]> {
  if (!supabaseConfigured) return fallbackAtivos();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true });
    if (error) throw error;
    return (data as Product[] | null) ?? [];
  } catch (e) {
    console.warn("[products] Supabase indisponível, usando fallback:", e);
    return fallbackAtivos();
  }
}

/** Um produto ativo pelo slug (para a página de detalhe). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!supabaseConfigured) {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.ativo) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("ativo", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Product | null) ?? null;
  } catch (e) {
    console.warn("[products] fallback getProductBySlug:", e);
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug && p.ativo) ?? null;
  }
}

/** Separa o catálogo em livros avulsos e combos (para a landing). */
export function splitCatalog(products: Product[]) {
  return {
    livros: products.filter((p) => p.tipo === "unico"),
    combos: products.filter((p) => p.tipo === "combo"),
  };
}
