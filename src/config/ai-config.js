import OpenAI from 'openai';
import { createClient } from "@supabase/supabase-js";

/** OpenAI config */
const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!openAiKey) throw new Error('VITE_OPENAI_API_KEY is required.');
export const openai = new OpenAI({
  apiKey: openAiKey,
  dangerouslyAllowBrowser: true,
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.')
}
export const supabase = createClient(supabaseUrl, supabaseKey);