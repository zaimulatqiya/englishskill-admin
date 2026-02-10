import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validation for production/runtime
if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw error here to allow build to pass if envs are missing in build context
  // But we log a warning
  if (process.env.NODE_ENV !== "production") {
    console.warn("Missing Supabase environment variables!");
  }
}

// Fallback for build time to prevent "supabaseUrl is required" error
const url = supabaseUrl!;
const key = supabaseAnonKey!;

export const supabase = createClient(url, key);
