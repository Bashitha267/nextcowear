import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Hardcoded credentials for demo
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const SESSION_COOKIE_NAME = 'dressco_admin_session';

/**
 * Validate admin credentials
 */
export function validateCredentials(username: string, password: string): boolean {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

/**
 * Create admin session
 */
export async function createSession(): Promise<void> {
    const cookieStore = await cookies();
    const sessionToken = generateSessionToken();

    cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
    });
}

/**
 * Destroy admin session
 */
export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return !!session?.value;
}

/**
 * Get current session
 */
export async function getSession(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Generate a simple session token
 */
function generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Redirect to login if not authenticated
 */
export function requireAuth() {
    return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
