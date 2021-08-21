import { createClient, SupabaseClient } from "@supabase/supabase-js";
export * from "./functions";
export * from "./models";

export function connectToSupabase(): SupabaseClient {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error("Supabase URL or key missing from environment");
  }
  return createClient(url, key);
}
