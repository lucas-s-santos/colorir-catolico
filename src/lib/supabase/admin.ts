import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "@/lib/config";

/**
 * Cliente com a SERVICE ROLE KEY — IGNORA o RLS.
 * Use SOMENTE no servidor (route handlers, server actions). Nunca exponha
 * ao cliente. É o que usamos para criar pedidos, gerar signed URLs dos PDFs,
 * e nas operações do /admin.
 */
export function createAdminClient() {
  return createSupabaseClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv().SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
