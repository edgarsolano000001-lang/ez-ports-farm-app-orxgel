import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://rgayzlgixuxfmdplyoum.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYXl6bGdpeHV4Zm1kcGx5b3VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NjMwMjgsImV4cCI6MjA3NzEzOTAyOH0.28WlD6xmNLPiTUMGE0Pc7ASR56a9_WgwhyPMSGh7EGA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
