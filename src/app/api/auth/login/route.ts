import { NextResponse } from 'next/server';
import { readDb, verifyPassword } from '@/lib/db';
import { setAdminSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// In-memory sliding rate limiter: max 5 failed attempts per IP within 15 minutes
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'default-ip';
    const now = Date.now();
    const attempts = loginAttempts.get(ip);

    if (attempts && attempts.count >= 5 && now - attempts.firstAttempt < 15 * 60 * 1000) {
      const waitMinutes = Math.ceil((15 * 60 * 1000 - (now - attempts.firstAttempt)) / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Please try again after ${waitMinutes} minutes.`,
        },
        { status: 429 }
      );
    }

    const { username, password, remember } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Please enter both username and password.' },
        { status: 400 }
      );
    }

    const db = readDb();
    const cleanUser = String(username).trim().toLowerCase();
    const user = db.users.find(
      (u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanUser
    );

    if (!user || !verifyPassword(password, user.password_hash)) {
      // Record failed attempt
      if (!attempts || now - attempts.firstAttempt > 15 * 60 * 1000) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
      } else {
        attempts.count += 1;
      }

      return NextResponse.json(
        { success: false, error: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Clear failed attempts on success
    loginAttempts.delete(ip);

    // Set secure HttpOnly session cookie
    const sessionPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + (remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
    };

    await setAdminSessionCookie(sessionPayload, Boolean(remember));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
