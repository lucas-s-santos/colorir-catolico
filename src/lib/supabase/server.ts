import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/config";

/**
 * Cliente Supabase para o servidor (chave anon, respeita o RLS).
 * Integra a sessão de Auth via cookies — usado para o login do /admin.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de um Server Component (sem permissão para set cookie).
            // O middleware renova a sessão; pode ignorar com segurança.
          }
        },
      },
    },
  );
}
