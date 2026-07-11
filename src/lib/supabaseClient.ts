import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type FriendCrmSupabaseClient = SupabaseClient;

let browserSupabaseClient: FriendCrmSupabaseClient | null = null;
let browserSupabaseClientKey = "";

export function getSupabaseConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  };
}

export function hasSupabaseConfig() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export function createFriendCrmSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
  }

  const clientKey = `${url}:${anonKey}`;
  if (browserSupabaseClient && browserSupabaseClientKey === clientKey) {
    return browserSupabaseClient;
  }

  browserSupabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  browserSupabaseClientKey = clientKey;
  return browserSupabaseClient;
}
