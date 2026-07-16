import { createClient } from "@supabase/supabase-js";

export function getMobileSupabaseConfig() {
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  };
}

export function hasMobileSupabaseConfig() {
  const { url, anonKey } = getMobileSupabaseConfig();
  return Boolean(url && anonKey);
}

export function createFriendCrmMobileSupabaseClient() {
  const { url, anonKey } = getMobileSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error("Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });
}

