import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isMock = !supabaseUrl || supabaseUrl === 'mock_url';

export const supabase = isMock ? null : createClient(supabaseUrl, supabaseAnonKey);

export const getSupabase = () => {
  if (isMock) {
    console.warn('Supabase is running in MOCK mode.');
    return {
      auth: {
        signUp: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: { id: 'mock-user-id' } }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: (table) => ({
        select: () => ({
          eq: () => ({
            order: async () => ({ data: [], error: null })
          })
        }),
        insert: async () => ({ data: null, error: null }),
        delete: () => ({
          eq: async () => ({ error: null })
        })
      })
    };
  }
  return supabase;
};
