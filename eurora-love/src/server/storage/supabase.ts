import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requiredEnv } from "@/server/env";

export function createServerClient() {
  return createSupabaseClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}
