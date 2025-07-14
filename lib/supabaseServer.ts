import { cookies as nextCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const createSupabaseServerClient = () => {
  const cookieStore = nextCookies();

  
  const cookieMethods = {
    get: (name: string) => {
      const cookie = cookieStore.get(name);
      return cookie?.value ?? null;
    },
    set: () => {}, // optional implement
    delete: () => {} // optional implement
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieMethods }
  );
};
