import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.replace(/\s+/g, "");

export const supabaseEnabled = Boolean(URL && KEY);

export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(URL!, KEY!, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

export const APP_NAMESPACE = (import.meta.env.VITE_APP_NAMESPACE || "political-system").replace(/\s+/g, "");
