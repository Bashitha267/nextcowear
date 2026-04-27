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
        fetch: (url, options = {}) => {
            // Set cache to no-store for Next.js Data Cache bypass
            options.cache = 'no-store';
            
            // Ensure headers exist
            if (!options.headers) {
                options.headers = {};
            }

            // Defensively add Cache-Control header to bypass CDN/Browser cache
            if (options.headers instanceof Headers) {
                options.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            } else if (Array.isArray(options.headers)) {
                (options.headers as string[][]).push(['Cache-Control', 'no-cache, no-store, must-revalidate']);
            } else {
                (options.headers as any)['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            }
            
            return fetch(url, options);
        },
    },
});
