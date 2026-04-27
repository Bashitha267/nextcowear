import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
}

// Pass cache: 'no-store' on every internal fetch so Next.js never caches
// Supabase responses at the HTTP level. Without this, even pages marked
// force-dynamic can serve stale text/images because Next.js caches the
// underlying fetch calls by default in the App Router.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (url, options = {}) =>
            fetch(url, {
                ...options,
                cache: 'no-store',
                headers: {
                    ...options.headers,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }),
    },
});
