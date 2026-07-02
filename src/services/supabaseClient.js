import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock client for local testing if keys are not provided
const isMock = !supabaseUrl || supabaseUrl === 'mock_url';

export const supabase = isMock 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

export const getSupabase = () => {
  if (isMock) {
    console.warn('Supabase is running in MOCK mode. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
    // Return a mock object that simulates supabase auth and db methods
    return {
      auth: {
        signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: (cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: (table) => ({
        select: () => ({
          eq: () => ({
            order: async () => ({ data: [], error: null })
          })
        }),
        insert: async () => ({ data: null, error: null })
      })
    };
  }
  return supabase;
};
