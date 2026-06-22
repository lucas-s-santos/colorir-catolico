import { z } from "zod";

/**
 * Configuração central de ambiente (validada com zod).
 *
 * - `publicEnv`: variáveis NEXT_PUBLIC_* — seguras para o cliente, validadas
 *   no momento do import.
 * - `serverEnv()`: segredos do servidor — validados de forma preguiçosa (só na
 *   primeira chamada, sempre no backend). Assim nunca vazam para o bundle do
 *   cliente e o `next build` não quebra por falta de valores em páginas
 *   estáticas que não usam esses segredos.
 */

// --- Variáveis públicas (cliente + servidor) -------------------------------
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Referência estática para o Next inlinar as variáveis no bundle do cliente.
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

// --- Variáveis de servidor (segredos) --------------------------------------
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MERCADOPAGO_ACCESS_TOKEN: z.string().min(1),
  MERCADOPAGO_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  DOWNLOAD_EXPIRES_DAYS: z.coerce.number().int().positive().default(7),
  DOWNLOAD_MAX: z.coerce.number().int().positive().default(5),
  SIGNED_URL_TTL_SECONDS: z.coerce.number().int().positive().default(600),
  WATERMARK_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

export type ServerEnv = z.infer<typeof serverSchema>;

let cached: ServerEnv | null = null;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const faltando = parsed.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(
      `Variáveis de ambiente do servidor inválidas/ausentes: ${faltando}. ` +
        `Confira seu .env.local (veja .env.example).`,
    );
  }
  cached = parsed.data;
  return cached;
}

/** Atalho para a URL base do site, sem barra no final. */
export const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/** Há credenciais reais do Supabase? (placeholder = ainda não configurado) */
export const supabaseConfigured =
  !publicEnv.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

/** Há credenciais reais do Mercado Pago? (usado para degradar com elegância) */
export function paymentsConfigured(): boolean {
  const t = process.env.MERCADOPAGO_ACCESS_TOKEN ?? "";
  return t.length > 0 && !t.includes("placeholder");
}

/** Há chave real do Resend? (e-mail transacional) */
export function emailConfigured(): boolean {
  const k = process.env.RESEND_API_KEY ?? "";
  return k.length > 0 && !k.includes("placeholder");
}
