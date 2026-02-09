import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Validate credentials
        if (!validateCredentials(username, password)) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Create session
        await createSession();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
