import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readDb } from './db';

const SESSION_SECRET = process.env.SESSION_SECRET || 'thendral-day-out-super-secret-key-panpoli-2026';
const COOKIE_NAME = 'tdo_admin_token';

export interface AdminSession {
  userId: string;
  username: string;
  role: string;
  exp: number;
}

export function createSignedToken(payload: AdminSession): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifySignedToken(token: string): AdminSession | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (signature !== expectedSignature) return null;

    const session: AdminSession = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (Date.now() > session.exp) return null;

    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifySignedToken(token);
  if (!session) return null;

  // Verify user still exists in DB
  const db = readDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return null;

  return session;
}

export async function setAdminSessionCookie(session: AdminSession, remember: boolean = false) {
  const token = createSignedToken(session);
  const cookieStore = await cookies();
  
  // 7 days if remember, else 24 hours
  const maxAge = remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60;

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
