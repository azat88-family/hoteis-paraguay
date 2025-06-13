// backend/src/config/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Estas variáveis devem ser configuradas no seu ambiente
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
  // Em um aplicativo real, você pode querer lançar um erro ou ter um fallback.
  // For now, this will allow the app to start but supabase operations will fail.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
