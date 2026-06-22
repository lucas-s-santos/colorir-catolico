import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/config";

/** Cliente Supabase para o navegador (chave anon, respeita o RLS). */
export function createClient() {
  return createBrowserClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
