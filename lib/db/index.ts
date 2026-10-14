import "server-only";
import { fileStore } from "./file";
import { supabaseStore } from "./supabase";
import type { Store } from "./types";

const hasSupabase = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function pick(): Store {
  if (hasSupabase()) return supabaseStore;
  if (process.env.NODE_ENV === "production") {
    // Never fall back to the local JSON file in production: it would silently lose data on serverless hosts.
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production.");
  }
  return fileStore;
}

// Resolved on first use (not at import) so `next build` works without secrets.
export const db: Store = new Proxy({} as Store, {
  get: (_t, prop) => (pick() as unknown as Record<string | symbol, unknown>)[prop],
});

export const storeKind = () => (hasSupabase() ? "supabase" : "local-file");
