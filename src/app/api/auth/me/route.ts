import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await clearAdminSessionCookie();
  return NextResponse.json({ success: true, message: 'Logged out successfully.' });
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      userId: session.userId,
      username: session.username,
      role: session.role,
    },
  });
}
